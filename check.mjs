import assert from "node:assert/strict";
import { fields } from "./fields.mjs";
import { payloadFrom } from "./validation.mjs";

export function sample(overrides = {}) {
  const form = new FormData();
  const values = {
    entry_date: "2026-11-06",
    case_study_name: "Lake Mendota",
    main_contributor: "Test contributor",
    regime_shift_types: ["Freshwater eutrophication"],
    latitude: "43.1",
    longitude: "-89.4",
    ...overrides,
  };
  for (const [name, value] of Object.entries(values)) {
    for (const item of Array.isArray(value) ? value : [value])
      form.append(name, item);
  }
  return form;
}

const payload = payloadFrom(sample());
assert.equal(Object.keys(payload).length, 42);
assert.equal(payload.other_contributors, null);
assert.equal(payload.introduction, null);
assert.equal(payload.ecosystem_types, null);
assert.equal(payload.longitude, -89.4);
assert.equal(payload.latitude, 43.1);
assert.deepEqual(
  payloadFrom(
    sample({ regime_shift_types: ["Freshwater eutrophication", "Hypoxia"] }),
  ).regime_shift_types,
  ["Freshwater eutrophication", "Hypoxia"],
);
assert.equal(
  payloadFrom(sample({ latitude: "0", longitude: "0" })).latitude,
  0,
);
assert.equal(
  payloadFrom(
    sample({ latitude: "59.354554337368825", longitude: "18.055187026593714" }),
  ).latitude,
  59.354554337368825,
);
for (const name of [
  "entry_date",
  "case_study_name",
  "main_contributor",
  "latitude",
  "longitude",
])
  assert.throws(() => payloadFrom(sample({ [name]: "" })), name);
assert.throws(() => payloadFrom(sample({ regime_shift_types: [] })));
for (const field of fields.filter((field) => field.choices)) {
  for (const choice of field.choices) {
    const result = payloadFrom(
      sample({ [field.name]: field.kind === "multi" ? [choice] : choice }),
    );
    assert.deepEqual(
      result[field.name],
      field.kind === "multi" ? [choice] : choice,
    );
  }
  assert.throws(() =>
    payloadFrom(
      sample({
        [field.name]: field.kind === "multi" ? ["Invalid"] : "Invalid",
      }),
    ),
  );
}
for (const year of ["1980", "1980 to 2000"])
  assert.equal(
    payloadFrom(sample({ year_or_duration: year })).year_or_duration,
    year,
  );
for (const change of [
  { entry_date: "2023-02-29" },
  { latitude: "91" },
  { longitude: "-181" },
  { latitude: "59N" },
  { longitude: "18 E" },
  { latitude: "Infinity" },
  { longitude: "1e2" },
  { year_or_duration: "2005 to 1990" },
  { year_or_duration: "0000" },
  { year_or_duration: "1990-2005" },
  { summary: "x".repeat(5001) },
  { main_contributor: "  " },
])
  assert.throws(() => payloadFrom(sample(change)));
const withExtra = sample();
withExtra.set("review_status", "approved");
assert.equal(payloadFrom(withExtra).review_status, undefined);
console.log(
  "PASS: all 42 fields, six required fields, every category choice, optional blanks, coordinate precision, date/year validation, and metadata exclusion.",
);
const links = [
  "https://doi.org/10.1126/science.aat7850",
  "https://openalex.org/W123456789",
];
assert.equal(
  payloadFrom(sample({ reference_doi: links })).reference_doi,
  links.join(", "),
);
assert.equal(
  payloadFrom(sample({ reference_doi: ["", ` ${links[0]} `, ""] }))
    .reference_doi,
  links[0],
);
assert.equal(
  payloadFrom(sample({ reference_doi: ["", " "] })).reference_doi,
  null,
);
assert.equal(
  payloadFrom(sample({ reference_doi: [links[0]] })).reference_doi,
  links[0],
);
for (const link of [
  "javascript:alert(1)",
  "10.1234/example",
  "https://example.org/a b",
  "https://user:password@example.org",
  "ftp://example.org",
])
  assert.throws(() => payloadFrom(sample({ reference_doi: [link] })));
assert.throws(() =>
  payloadFrom(
    sample({
      reference_doi: [
        "https://example.org/" + "a".repeat(5000),
        "https://example.org/" + "b".repeat(5000),
      ],
    }),
  ),
);
console.log(
  "PASS: multiple links join with commas; blanks are ignored; URLs and combined length are validated.",
);
