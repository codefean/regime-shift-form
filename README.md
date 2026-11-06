# Regime Shifts Database submission form

A GitHub Pages form that submits case studies to Supabase PostgreSQL. It reproduces the RSDB case study template and adds an interactive location search and map pin.

## Database setup

Run `database/setup.sql` once in the **regime-shift-form** project's Supabase SQL Editor. It creates `public.regime_shift_submissions`. Use a new project or verify that this table does not already exist; the script does not overwrite an existing table.

The form uses `https://qyampfminybmdrbthunx.supabase.co`. Its public publishable key is in `config.js`. Never add a secret key or database password to this repository.

Submissions enter with `review_status = pending`. Researchers can review and approve/reject them in Supabase Table Editor. Anonymous visitors can insert only the 42 form fields; they cannot read, update, delete, or set review metadata. Five database-managed columns bring the table to 47 columns: id, submitted_at, review_status, reviewer_notes, and schema_version.

The permission checks in `database/check-permissions.sql` roll back their test row.

## Required fields

- Date
- Case study name
- Main contributor
- Type of regime shift (one or more)
- Latitude
- Longitude

Other fields are optional. Blank answers are stored as null, distinct from choosing an explicit Unknown option. The reference Google form originally required only the first three fields; type and coordinates are also required for this implementation.

## Form behavior

- All categories are retained from the reference template, including its spelling of Moonson.
- Regime-shift type supports multiple selections, as its original help text describes. Ecosystems, land uses, continents/oceans, drivers, impacts, SDGs, time scales, and evidence also support multiple selections.
- Spatial scale, reversibility, and the two confidence fields accept one choice.
- Region and countries are separate from the map's place label. Countries remain comma-separated text, as in the template.
- Coordinates are WGS84 numeric decimal latitude/longitude. A pin represents a point, not a study-area boundary.
- Year/duration accepts YYYY or YYYY to YYYY. Date is the template's Date field; it is not inferred to be the date of the regime shift.
- Threshold variables, values, and units are kept as text to preserve multiple values and the source's notation. Reference text and DOI/link fields keep matching (#1), (#2) IDs.
- The detailed narrative section is expandable and optional. Word-count guidance follows the template; character limits bound storage without imposing an additional word-count rule.
- Diagrams and photos are provided as text/links; no files are uploaded.

## Publish and check

GitHub Pages publishes from `main`, `/ (root)`. No build step is needed.

```sh
node check.mjs
python3 -m http.server 8000
```

Open http://localhost:8000. After database setup, submit a clearly labeled test case and check Supabase Table Editor for the new row. An uncertain network response can mean the first submission arrived; retrying may create a duplicate.

## Map services

Leaflet 1.9.4 is loaded from jsDelivr. The map uses Photon search and OpenStreetMap tiles with attribution. Search text goes to Photon. No device geolocation is requested. Endpoints can be changed in `map-config.mjs`.

These public services are for light pilot use. Use an appropriate hosted/self-hosted provider for substantial traffic, and add server-side spam protection before broad promotion. Row-level security limits database access; it does not stop automated submissions.

- Reference template: https://docs.google.com/forms/d/e/1FAIpQLSe-zLessmx5jMPWO6Q6jtNYzD6Dj4h3bBRbxkBB_sSGxoi50g/viewform
- Regime Shifts Database: https://regimeshifts.org/
- Photon: https://github.com/komoot/photon
- OpenStreetMap tile policy: https://operations.osmfoundation.org/policies/tiles/
