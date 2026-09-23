/* ==========================================================================
   The Kult LA — GoHighLevel lead handler
   Receives every website form submission and creates/updates the contact in
   the GoHighLevel (LeadConnector) sub-account, tags it and stores the message.

   Required environment variable (set in the hosting dashboard):
     GHL_API_KEY  — Private Integration token for the sub-account, with the
                    contacts.write / contacts.readonly / locations.readonly scopes.
   Optional:
     GHL_LOCATION_ID — overrides the sub-account below.
   ========================================================================== */

var API_BASE = 'https://services.leadconnectorhq.com';
var API_VERSION = '2021-07-28';
var DEFAULT_LOCATION_ID = 'PkdMCggAN3lerFXTcCCW';
var LEAD_TAG = 'website-lead';
var LEAD_SOURCE_VALUE = 'Website';

function token() {
  return (
    process.env.GHL_API_KEY ||
    process.env.GHL_ACCESS_TOKEN ||
    process.env.GHL_PRIVATE_TOKEN ||
    process.env.HIGHLEVEL_API_KEY ||
    ''
  ).trim();
}

function locationId() {
  return (process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID).trim();
}

function headers() {
  return {
    Authorization: 'Bearer ' + token(),
    Version: API_VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

function str(value) {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
}

function splitName(full, first, last) {
  var f = str(first);
  var l = str(last);
  if (f || l) return { firstName: f, lastName: l };

  var parts = str(full).split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

/* Resolve the "Lead Source" / "Website Form" custom fields by name so we can
   send their real ids. Falls back to fieldKey-style keys if the lookup fails. */
async function resolveCustomFields(wanted) {
  var map = {};
  try {
    var res = await fetch(API_BASE + '/locations/' + locationId() + '/customFields', {
      method: 'GET',
      headers: headers()
    });
    if (!res.ok) return null;
    var data = await res.json();
    var fields = data.customFields || data.customField || [];
    fields.forEach(function (field) {
      var name = str(field.name).toLowerCase();
      wanted.forEach(function (label) {
        if (name === label.toLowerCase() && field.id) map[label] = field.id;
      });
    });
  } catch (err) {
    return null;
  }
  return map;
}

function fallbackKey(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

async function buildCustomFields(formName) {
  var wanted = ['Lead Source', 'Website Form'];
  var values = {};
  values['Lead Source'] = LEAD_SOURCE_VALUE;
  values['Website Form'] = formName;

  var resolved = await resolveCustomFields(wanted);

  return wanted.map(function (label) {
    if (resolved && resolved[label]) {
      return { id: resolved[label], field_value: values[label] };
    }
    return { key: fallbackKey(label), field_value: values[label] };
  });
}

function noteBody(payload) {
  var lines = [
    'New website form submission — ' + payload.formName,
    '',
    'Name: ' + (payload.name || '—'),
    'Email: ' + (payload.email || '—'),
    'Phone: ' + (payload.phone || '—')
  ];

  if (payload.company) lines.push('Business / brand: ' + payload.company);
  if (payload.service) lines.push('Service needed: ' + payload.service);
  if (payload.budget) lines.push('Budget range: ' + payload.budget);
  if (payload.timeline) lines.push('Ideal timeline: ' + payload.timeline);
  if (payload.pageUrl) lines.push('Page: ' + payload.pageUrl);

  lines.push('', 'Message:', payload.message || '—');
  return lines.join('\n');
}

async function upsertContact(body) {
  var res = await fetch(API_BASE + '/contacts/upsert', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  });

  var data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  return { ok: res.ok, status: res.status, data: data };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  var payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      payload = null;
    }
  }
  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ ok: false, error: 'Invalid request body' });
    return;
  }

  // Honeypot — pretend everything is fine, store nothing.
  if (str(payload.website)) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  var email = str(payload.email);
  var phone = str(payload.phone);
  if (!email && !phone) {
    res.status(400).json({ ok: false, error: 'An email address or phone number is required.' });
    return;
  }

  if (!token()) {
    // Not configured yet — let the browser fall back to the email handoff.
    res.status(503).json({ ok: false, configured: false, error: 'CRM is not configured.' });
    return;
  }

  var names = splitName(payload.name, payload.firstName, payload.lastName);
  var formName = str(payload.formName) || 'Website Form';
  var message = str(payload.message);

  var details = {
    name: str(payload.name) || [names.firstName, names.lastName].filter(Boolean).join(' '),
    email: email,
    phone: phone,
    company: str(payload.company),
    service: str(payload.service),
    budget: str(payload.budget),
    timeline: str(payload.timeline),
    pageUrl: str(payload.pageUrl),
    formName: formName,
    message: message
  };

  var contactBody = {
    locationId: locationId(),
    firstName: names.firstName,
    lastName: names.lastName,
    name: details.name,
    email: email,
    phone: phone,
    source: LEAD_SOURCE_VALUE,
    tags: [LEAD_TAG]
  };

  if (details.company) contactBody.companyName = details.company;

  try {
    contactBody.customFields = await buildCustomFields(formName);

    var result = await upsertContact(contactBody);

    // If the custom fields were rejected, still save the lead without them.
    if (!result.ok && contactBody.customFields) {
      delete contactBody.customFields;
      result = await upsertContact(contactBody);
    }

    if (!result.ok) {
      res.status(502).json({
        ok: false,
        error: (result.data && (result.data.message || result.data.error)) || 'CRM rejected the submission.'
      });
      return;
    }

    var contact = (result.data && (result.data.contact || result.data)) || {};
    var contactId = contact.id || contact.contactId || contact._id || '';

    // Store the message (and the rest of the enquiry) as a note on the contact.
    if (contactId) {
      try {
        await fetch(API_BASE + '/contacts/' + contactId + '/notes', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ body: noteBody(details) })
        });
      } catch (err) {
        /* The contact is saved; a failed note must not fail the submission. */
      }
    }

    res.status(200).json({ ok: true, contactId: contactId });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Could not reach the CRM.' });
  }
};
