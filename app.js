import {config} from './config.js';
import {sections} from './fields.mjs';
import {payloadFrom} from './validation.mjs';
import {setupLocation} from './location.mjs';

const form = document.querySelector('#case-form');
const button = document.querySelector('#submit');
const message = document.querySelector('#message');
const container = document.querySelector('#sections');

for (const [index, section] of sections.entries()) {
  const element = document.createElement(section.optional ? 'details' : 'section');
  element.className = section.optional ? 'section analysis-section' : 'section';
  element.id = section.id;
  const heading = document.createElement(section.optional ? 'summary' : 'h2');
  heading.textContent = `${String(index + 1).padStart(2, '0')}  ${section.title}${section.optional ? ' (optional)' : ''}`;
  element.append(heading);
  if (section.description) {
    const description = document.createElement('p');
    description.className = 'section-description';
    description.textContent = section.description;
    element.append(description);
  }
  for (const field of section.fields) {
    const wrapper = document.createElement('div');
    wrapper.className = `field field-${field.kind}`;
    const label = document.createElement(field.kind === 'multi' ? 'div' : 'label');
    label.id = `${field.name}-label`;
    label.className = 'field-label';
    label.textContent = field.label;
    if (field.kind !== 'multi') label.htmlFor = field.name;
    if (field.required) {
      const star = document.createElement('span');
      star.className = 'required';
      star.textContent = ' *';
      star.setAttribute('aria-hidden', 'true');
      label.append(star);
    }
    wrapper.append(label);
    if (field.help) {
      const help = document.createElement('p');
      help.id = `${field.name}-help`;
      help.className = 'help';
      help.textContent = field.help;
      wrapper.append(help);
    }
    if (field.kind === 'multi') {
      const dropdown = document.createElement('details');
      dropdown.className = 'multi';
      const summary = document.createElement('summary');
      summary.textContent = 'Select options';
      summary.setAttribute('aria-label', `${field.label}${field.required ? ' (required)' : ''}`);
      const count = document.createElement('span');
      count.className = 'selection-count';
      count.textContent = '0 selected';
      summary.append(count);
      if (field.help) summary.setAttribute('aria-describedby', `${field.name}-help`);
      const options = document.createElement('div');
      options.className = 'options';
      options.setAttribute('role', 'group');
      options.setAttribute('aria-labelledby', label.id);
      const preview = document.createElement('p');
      preview.className = 'selection-preview';
      function updateSelection() {
        const selected = [...options.querySelectorAll('input:checked')].map(input => input.value);
        count.textContent = `${selected.length} selected`;
        preview.textContent = selected.join(' · ');
      }
      for (const choice of field.choices) {
        const option = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = field.name;
        input.value = choice;
        input.addEventListener('change', updateSelection);
        option.append(input, document.createTextNode(choice));
        options.append(option);
      }
      dropdown.append(summary, options);
      wrapper.append(dropdown, preview);
      form.addEventListener('reset', () => {
        dropdown.open = false;
        setTimeout(updateSelection, 0);
      });
    } else {
      const input = document.createElement(field.kind === 'textarea' ? 'textarea' : field.kind === 'select' ? 'select' : 'input');
      input.name = field.name;
      input.id = field.name;
      input.required = Boolean(field.required);
      if (field.maxLength) input.maxLength = field.maxLength;
      if (field.help) input.setAttribute('aria-describedby', `${field.name}-help`);
      if (field.kind === 'select') {
        input.add(new Option('Leave blank / not reported', ''));
        for (const choice of field.choices) input.add(new Option(choice, choice));
      } else if (field.kind === 'textarea') {
        input.rows = 4;
      } else {
        input.type = field.kind === 'date' ? 'date' : 'text';
        if (field.kind === 'coordinate') input.inputMode = 'decimal';
      }
      wrapper.append(input);
      if (field.name === 'location') {
        input.autocomplete = 'off';
        const row = document.createElement('div');
        row.className = 'search-row';
        const search = document.createElement('button');
        search.id = 'search';
        search.type = 'button';
        search.textContent = 'Search map';
        row.append(input, search);
        wrapper.append(row);
        const status = document.createElement('p');
        status.id = 'map-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        const results = document.createElement('div');
        results.id = 'search-results';
        const map = document.createElement('div');
        map.id = 'map';
        map.setAttribute('role', 'region');
        map.setAttribute('aria-label', 'Case study location map. Click to place a pin, or enter coordinates below.');
        const clear = document.createElement('button');
        clear.id = 'clear-location';
        clear.type = 'button';
        clear.className = 'secondary';
        clear.textContent = 'Clear pin and coordinates';
        const credit = document.createElement('p');
        credit.className = 'map-credit';
        credit.textContent = 'Search text is sent to Photon. Map tiles are provided by OpenStreetMap. Coordinates are required; choose a representative point for a larger study area.';
        wrapper.append(status, results, map, clear, credit);
      }
    }
    element.append(wrapper);
  }
  container.append(element);
}

const projectUrl = config.supabaseUrl.trim().replace(/\/$/, '');
const key = config.publishableKey.trim();
const ready = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(projectUrl) && key.startsWith('sb_publishable_');
button.disabled = !ready;
if (!ready) document.querySelector('#setup').textContent = 'Preview only — the research database is not connected yet.';
setupLocation(form);
form.addEventListener('invalid', event => {
  const section = event.target.closest('.analysis-section');
  if (section) section.open = true;
}, true);
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!ready || button.disabled) return;
  message.textContent = '';
  message.dataset.error = 'false';
  try {
    const payload = payloadFrom(new FormData(form));
    button.disabled = true;
    message.textContent = 'Submitting your case study…';
    const response = await fetch(`${projectUrl}/rest/v1/regime_shift_submissions`, {
      method: 'POST',
      headers: {apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal'},
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) throw Error(`The database did not accept this case study (HTTP ${response.status}). Your entries are still here. Please try again later or contact the research team.`);
    form.reset();
    document.querySelector('#analysis').open = false;
    message.textContent = 'Thank you. Your case study has been submitted for researcher review.';
  } catch (error) {
    message.dataset.error = 'true';
    message.textContent = ['TypeError', 'TimeoutError', 'AbortError'].includes(error.name)
      ? 'We could not confirm delivery. Your entries are still here. Retrying may create a duplicate if the first submission arrived.'
      : error.message;
  } finally {
    button.disabled = false;
    message.focus();
  }
});
