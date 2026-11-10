# Regime Shifts Database — a guide to the submission form

Hi Emmy,

This guide explains the code behind the case-study submission form and how its database works. The form collects the location, characteristics, drivers, impacts, references, and optional narrative for a regime-shift case study. Submissions go to a Supabase PostgreSQL database for researcher review.

Code: [github.com/codefean/regime-shift-form](https://github.com/codefean/regime-shift-form).

## Where to start

Start with `fields.mjs`: it defines every question, its help text, whether it is required, and its available choices. `app.js` turns those definitions into form controls and handles submission. The SQL files in `database/` define storage, validation, and access permissions.

The website uses HTML, CSS, and JavaScript without an application framework or build step. Supabase supplies the database and submission API.

## What each file does

| File                             | Purpose                                                                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                     | The page shell, navigation, introduction, form container, and submission message. Most questions are added by JavaScript.                                  |
| `style.css`                      | Fonts, colours, spacing, and desktop/mobile layouts.                                                                                                       |
| `fields.mjs`                     | The 42 form-field definitions, grouped into seven sections.                                                                                                |
| `app.js`                         | Builds the form controls, manages multiple reference-link inputs, collects answers, and sends reports to Supabase.                                         |
| `validation.mjs`                 | Checks required answers, categories, coordinates, dates, year ranges, text lengths, and reference-link formats. Converts blank optional answers to `null`. |
| `location.mjs`                   | Place search, search results, the draggable map pin, and coordinate entry.                                                                                 |
| `map-config.mjs`                 | Place-search and map-tile endpoints and map attribution.                                                                                                   |
| `config.js`                      | The Supabase project URL and public publishable key used by the browser.                                                                                   |
| `check.mjs`                      | Automated checks for the JavaScript validation. These do not send anything to Supabase.                                                                    |
| `database/setup.sql`             | Creates the submissions table, database constraints, permissions, and row-level security policy.                                                           |
| `database/check-permissions.sql` | Tests permitted submissions, blocked public access, protected metadata, and invalid inputs. Rolls back test records.                                       |
| `assets/`                        | Source Sans Pro font files and their complete font licence.                                                                                                |

The `.mjs` files are JavaScript modules that share functions and values through imports and exports.

## How a submission reaches the database

1. The visitor fills in the questions and chooses a map point or enters coordinates.
2. The browser checks the answers and prepares a data object containing the 42 form fields.
3. It sends that object to Supabase over HTTPS.
4. The database checks its constraints and permissions, then saves an accepted report as a new row.
5. The database assigns an ID, submission time, `pending` review status, and schema version `1`.
6. The form clears after a successful response. If submission fails, the answers stay in the form.

The six required fields are **Date, Case study name, Main contributor, Type of regime shift, Latitude, and Longitude**. The type can include several selections. The Date field is the template's entry date; it is not automatically interpreted as the date of the regime shift. `year_or_duration` records the shift's year or period separately.

Optional blank answers are stored as `NULL`, meaning no value was supplied. That is different from explicitly selecting an available `Unknown` option.

## How the database is organised

One table, `public.regime_shift_submissions`, stores the reports. Each row is a submission, not necessarily a verified or unique case. It contains 42 form fields and five database-managed fields.

| Group                     | Stored fields and meaning                                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Case study and location   | `entry_date`, `case_study_name`, `location`, `latitude`, `longitude`, `region`, `countries`, `continents_oceans`. The map label, region, and countries remain separate.                                               |
| Contributors              | `main_contributor`, `other_contributors`: contributor names.                                                                                                                                                          |
| Basic information         | `summary`, `regime_shift_types`, `regime_shift_type_other`, `ecosystem_types`, `land_uses`, `spatial_scale`.                                                                                                          |
| Drivers and impacts       | `direct_drivers`, `ecosystem_processes`, `provisioning_services`, `regulating_services`, `cultural_services`, `human_wellbeing`, `sdgs`.                                                                              |
| Key attributes            | `time_scales`, `reversibility`, `evidence`, `confidence_existence`, `confidence_mechanism`, `year_or_duration`.                                                                                                       |
| Thresholds and references | `threshold_variable`, `threshold_value`, `threshold_units`, `reference_text`, `reference_doi`. Threshold values remain text to preserve source notation and multiple values.                                          |
| Optional narrative        | `introduction`, `alternate_regimes`, `drivers_causes`, `shift_mechanism`, `impacts_narrative`, `management_options`, `diagrams_photos`, `observations_comments`.                                                      |
| Database-managed fields   | `id` uniquely identifies the submission; `submitted_at` records receipt time; `review_status` is `pending`, `approved`, or `rejected`; `reviewer_notes` holds research-team notes; `schema_version` is currently `1`. |

Multiple-choice answers are PostgreSQL arrays: one report can hold several selections. Single-choice answers are text. Coordinates are numeric decimal latitude/longitude, and the map point represents a location rather than a study-area boundary.

Reference links have separate input boxes, but are stored together as comma-separated text in `reference_doi`. Reference citations are stored separately in `reference_text`; they are not automatically linked to individual URLs. Countries are also stored as comma-separated text. Diagrams and photos are described through text or links; there are no file uploads.

## Permissions and researcher review

The supplied SQL allows anonymous visitors to insert only the 42 form fields. It grants them no permission to read, edit, or delete submissions or to assign any of the five database-managed fields. Row-level security additionally requires public submissions to have a `pending` review status, no reviewer notes, and schema version `1`.

The key in `config.js` is a public publishable key intended for browser use. Database permissions enforce access restrictions. Secret keys and database passwords must not be added to the website.

Researchers with appropriate Supabase project access can inspect the table through the dashboard, review references, and update the status and notes. This repository does not include a separate researcher-review interface. Marking a row `approved` does not automatically publish it to regimeshifts.org.

## Running and checking it

From the repository folder, with Python 3 installed:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The local preview uses the database configured in `config.js`, so submitting can create a real record. Use a separate test Supabase project for submission testing.

Run the browser-validation checks with a recent Node.js version supporting `FormData`:

```sh
node check.mjs
```

For a new Supabase project, run `database/setup.sql` once in its SQL editor. Do not rerun it on an existing configured database. The separate `database/check-permissions.sql` script rolls back its test records; if it fails, run `ROLLBACK;` before retrying in the same session.

The website can be hosted on GitHub Pages from `main`, `/ (root)`, with no build step. This is the documented hosting configuration, rather than a verification of current repository settings.

If category choices change, update both `fields.mjs` and the database's allowed-value constraints. Apply a new migration to an existing database rather than rerunning `setup.sql`. The existing `Moonson` label is retained from the original field definitions.

## Maps and current limitations

Leaflet displays the map, Photon supplies place search, and OpenStreetMap supplies the tiles. Search text goes to Photon; device geolocation is not requested. Contributors can enter coordinates manually if these services are unavailable.

This is a submission-and-review pilot. It has no automatic duplicate detection, source verification, or server-side spam protection. An uncertain network response can mean a report arrived, so retrying may create a duplicate.

Reference URLs are checked by the browser, while the database currently enforces only their combined text length. Direct API requests can bypass the browser's URL checks. Narrative word counts are guidance; storage limits are enforced as character limits. Comma-separated reference storage should not be treated as an unambiguous list format, because URLs themselves can contain commas.

Before broad public promotion, add server-side submission abuse controls and confirm that the map services suit the expected traffic. The supplied SQL describes intended permissions; verify the deployed project's settings separately.

## References and licences

- [Original case-study template](https://docs.google.com/forms/d/e/1FAIpQLSe-zLessmx5jMPWO6Q6jtNYzD6Dj4h3bBRbxkBB_sSGxoi50g/viewform)
- [Regime Shifts Database](https://regimeshifts.org/)
- [Photon](https://github.com/komoot/photon)
- [OpenStreetMap tile policy](https://operations.osmfoundation.org/policies/tiles/)
- [Source Sans Pro font licence](assets/Source-Sans-Pro-LICENSE.md)
