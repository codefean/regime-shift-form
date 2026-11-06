import {fields} from './fields.mjs?v=3';

export function coordinate(value, limit) {
  const text = String(value ?? '').trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) {
    throw Error('Enter coordinates as decimal numbers, without N, S, E, or W.');
  }
  const number = Number(text);
  if (!Number.isFinite(number) || Math.abs(number) > limit) {
    throw Error(`Coordinates must be between -${limit} and ${limit}.`);
  }
  return number;
}

export function payloadFrom(form) {
  const payload = {};
  for (const field of fields) {
    let value = String(form.get(field.name) ?? '').trim();
    if (field.kind === 'links') {
      const links = form.getAll(field.name).map(link => String(link).trim()).filter(Boolean);
      for (const link of links) {
        let url;
        try { url = new URL(link); } catch { throw Error('Enter a full http:// or https:// source link in each reference box.'); }
        if (!/^https?:\/\/\S+$/i.test(link) || !url.hostname || url.username || url.password) throw Error('Reference links must use http:// or https:// and must not contain spaces or login details.');
      }
      value = links.join(', ');
    }
    if (field.required && !value) throw Error(`Please complete ${field.label}.`);
    if (field.kind === 'multi') {
      const selected = [...new Set(form.getAll(field.name))];
      if (selected.some(choice => !field.choices.includes(choice))) throw Error(`Invalid selection for ${field.label}.`);
      payload[field.name] = selected.length ? selected : null;
      continue;
    }
    if (!value) {
      payload[field.name] = null;
      continue;
    }
    if (field.maxLength && value.length > field.maxLength) throw Error(`${field.label} allows up to ${field.maxLength.toLocaleString()} characters.`);
    if (field.kind === 'select' && !field.choices.includes(value)) throw Error(`Invalid selection for ${field.label}.`);
    if (field.kind === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) throw Error('Enter a valid date.');
    payload[field.name] = field.kind === 'coordinate' ? coordinate(value, field.name === 'latitude' ? 90 : 180) : value;
  }
  if (payload.year_or_duration) {
    const match = /^(\d{4})(?: to (\d{4}))?$/.exec(payload.year_or_duration);
    if (!match || Number(match[1]) === 0 || (match[2] && Number(match[2]) < Number(match[1]))) throw Error('Use YYYY or YYYY to YYYY, with the ending year at or after the starting year.');
  }
  return payload;
}
