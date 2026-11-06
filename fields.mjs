export const sections = [
  {
    "id": "case-study",
    "title": "Case study and location",
    "fields": [
      {
        "name": "entry_date",
        "label": "Date",
        "kind": "date",
        "required": true
      },
      {
        "name": "case_study_name",
        "label": "Case study name",
        "kind": "text",
        "help": "Short, succinct name for the case study (e.g. Lake Mendota).",
        "required": true,
        "maxLength": 300
      },
      {
        "name": "location",
        "label": "Find a place on the map",
        "kind": "text",
        "help": "Search for a place, choose a result, then click the map or drag the pin to the study location. You can also enter coordinates directly.",
        "maxLength": 300
      },
      {
        "name": "latitude",
        "label": "Latitude",
        "kind": "coordinate",
        "help": "Decimal number from -90 to 90. No N, S, E, or W.",
        "required": true
      },
      {
        "name": "longitude",
        "label": "Longitude",
        "kind": "coordinate",
        "help": "Decimal number from -180 to 180. No N, S, E, or W.",
        "required": true
      },
      {
        "name": "region",
        "label": "Region",
        "kind": "text",
        "help": "Region where the case study lies (e.g. Wisconsin, southern Africa).",
        "maxLength": 1000
      },
      {
        "name": "countries",
        "label": "Countries",
        "kind": "text",
        "help": "Countries in which the case lies. Separate multiple countries with commas (e.g. USA, Sweden).",
        "maxLength": 1000
      },
      {
        "name": "continents_oceans",
        "label": "Continent or Ocean",
        "kind": "multi",
        "choices": [
          "Africa",
          "Antarctica",
          "Asia",
          "Australia & New Zealand",
          "Europe",
          "North America",
          "Central America",
          "South America",
          "Arctic Ocean",
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Southern Ocean"
        ]
      }
    ]
  },
  {
    "id": "contributors",
    "title": "Contributors",
    "fields": [
      {
        "name": "main_contributor",
        "label": "Main contributor",
        "kind": "text",
        "help": "Names of those who primarily contributed to the text (comma separated if many).",
        "required": true,
        "maxLength": 1000
      },
      {
        "name": "other_contributors",
        "label": "Other contributors",
        "kind": "text",
        "help": "Names of others who contributed to and reviewed the text (comma separated if many).",
        "maxLength": 1000
      }
    ]
  },
  {
    "id": "basic",
    "title": "Basic information",
    "description": "Basic information about the regime shift case. If you do not know the answer or the paper does not provide it, leave the field empty.",
    "fields": [
      {
        "name": "summary",
        "label": "Summary",
        "kind": "textarea",
        "help": "Briefly summarise the type of system, alternate regimes, timing, key feedbacks and drivers, impacts on ecosystem services and human well-being, and management interventions. Note features that distinguish this case from the generic regime shift. Aim for a maximum of 250 words.",
        "maxLength": 5000
      },
      {
        "name": "regime_shift_types",
        "label": "Type of regime shift",
        "kind": "multi",
        "help": "A case study may be an example of more than one type. Select all that apply. For a type not listed, select Proposed & new type and describe it below.",
        "choices": [
          "Arctic benthos borealisation",
          "Arctic sea-ice loss",
          "Bivalves collapse",
          "Bush encroachment",
          "Common pool resource harvesting",
          "Coniferous to deciduous forest",
          "Coral transitions",
          "Fisheries collapse",
          "Floating plants",
          "Forest to savanna",
          "Freshwater eutrophication",
          "Greenland ice sheet collapse",
          "Hypoxia",
          "Kelp transitions",
          "Mangroves transitions",
          "Marine eutrophication",
          "Marine food webs",
          "Moonson",
          "Peatland transitions",
          "Primary production Arctic Ocean",
          "River channel change",
          "Salt marshes to tidal flats",
          "Seagrass transitions",
          "Soil salinization",
          "Sprawling vs compact city",
          "Steppe to tundra",
          "Thermohaline circulation",
          "Thermokarst lakes",
          "Tundra to forest",
          "West Antarctic ice sheet collapse",
          "Proposed & new type",
          "To be determined",
          "Unknown"
        ],
        "required": true
      },
      {
        "name": "regime_shift_type_other",
        "label": "Type of regime shift — other",
        "kind": "text",
        "help": "If the type is not listed, select Proposed & new type above and enter the type here.",
        "maxLength": 1000
      },
      {
        "name": "ecosystem_types",
        "label": "Ecosystem type",
        "kind": "multi",
        "help": "Ecosystem type in which the case study is located.",
        "choices": [
          "Marine & coastal",
          "Freshwater lakes & rivers",
          "Temperate & boreal forest",
          "Tropical forests",
          "Moist savannas & woodlands",
          "Drylands & deserts (below ~500mm rainfall/year)",
          "Mediterranean shrub (Fynbos)",
          "Grasslands",
          "Tundra",
          "Rock & ice",
          "Agro-ecosystems",
          "Planetary"
        ]
      },
      {
        "name": "land_uses",
        "label": "Land uses",
        "kind": "multi",
        "help": "Land uses in the case study.",
        "choices": [
          "Urban",
          "Small-scale subsistence crop cultivation",
          "Large-scale commercial crop cultivation",
          "Intensive livestock production (e.g. feedlots, dairies)",
          "Extensive livestock production (natural rangelands)",
          "Timber production",
          "Fisheries",
          "Mining",
          "Conservation",
          "Tourism"
        ]
      },
      {
        "name": "spatial_scale",
        "label": "Spatial scale of the case study",
        "kind": "select",
        "choices": [
          "Local/landscape (e.g. lake, catchment, community)",
          "National (country)",
          "Sub-continental (e.g. southern Africa, Amazon basin)",
          "Global"
        ]
      }
    ]
  },
  {
    "id": "drivers",
    "title": "Drivers and impacts",
    "description": "Select only the processes and impacts mentioned in the paper. Leave unanswered groups empty.",
    "fields": [
      {
        "name": "direct_drivers",
        "label": "Drivers — Key direct drivers",
        "kind": "multi",
        "help": "Key direct drivers of the regime shift.",
        "choices": [
          "Vegetation conversion and habitat fragmentation",
          "Harvest and resource consumption",
          "External inputs (e.g. fertilizers, pest control, irrigation)",
          "Adoption of new technology (e.g. new fishing nets)",
          "Infrastructure development (e.g. roads, pipelines)",
          "Species introduction or removal",
          "Disease",
          "Soil erosion & land degradation",
          "Environmental shocks (e.g. fire, floods, droughts)",
          "Global climate change"
        ]
      },
      {
        "name": "ecosystem_processes",
        "label": "Impacts — Key Ecosystem Processes",
        "kind": "multi",
        "choices": [
          "Soil formation",
          "Primary production",
          "Nutrient cycling",
          "Water cycling"
        ]
      },
      {
        "name": "provisioning_services",
        "label": "Impacts — Provisioning services",
        "kind": "multi",
        "choices": [
          "Freshwater",
          "Food crops",
          "Livestock",
          "Fisheries",
          "Wild animal and plant products",
          "Timber",
          "Woodfuel",
          "Feed, fuel and fiber crops",
          "Hydropower"
        ]
      },
      {
        "name": "regulating_services",
        "label": "Impacts — Regulating services",
        "kind": "multi",
        "choices": [
          "Air quality regulation",
          "Climate regulation",
          "Water purification",
          "Water regulation",
          "Regulation of soil erosion",
          "Pest & disease regulation",
          "Pollination",
          "Natural hazard regulation"
        ]
      },
      {
        "name": "cultural_services",
        "label": "Impacts — Cultural services",
        "kind": "multi",
        "choices": [
          "Recreation",
          "Aesthetic values",
          "Knowledge and educational values",
          "Spiritual and religious"
        ]
      },
      {
        "name": "human_wellbeing",
        "label": "Impacts on Human Well-being",
        "kind": "multi",
        "choices": [
          "Food and nutrition",
          "Health (e.g. toxins, disease)",
          "Livelihoods and economic activity",
          "Security of housing & infrastructure",
          "Aesthetic and recreational values",
          "Cultural identity",
          "Social conflict",
          "No direct impact"
        ]
      },
      {
        "name": "sdgs",
        "label": "Impacts — Sustainable Development Goals (SDGs)",
        "kind": "multi",
        "choices": [
          "No poverty",
          "Zero hunger",
          "Good health and well-being",
          "Quality education",
          "Gender equality",
          "Clean water and sanitation",
          "Affordable and clean energy",
          "Decent work and economic growth",
          "Industry, innovation & infrastructure",
          "Reduced inequalities",
          "Sustainable cities and communities",
          "Responsible consumption and production",
          "Climate action",
          "Life below water",
          "Life on land",
          "Peace, justice and strong institutions",
          "Partnerships for the goals"
        ]
      }
    ]
  },
  {
    "id": "attributes",
    "title": "Key attributes",
    "fields": [
      {
        "name": "time_scales",
        "label": "Time scale of the regime shift",
        "kind": "multi",
        "choices": [
          "Weeks",
          "Months",
          "Years",
          "Decades",
          "Centuries",
          "Unknown"
        ]
      },
      {
        "name": "reversibility",
        "label": "Reversibility",
        "kind": "select",
        "choices": [
          "Irreversible (on 100 year time scale)",
          "Hysteretic (difficult to reverse)",
          "Readily reversible",
          "Unknown"
        ]
      },
      {
        "name": "evidence",
        "label": "Evidence",
        "kind": "multi",
        "choices": [
          "Models",
          "Paleo-observation",
          "Contemporary observations",
          "Experiments",
          "Other"
        ]
      },
      {
        "name": "confidence_existence",
        "label": "Confidence: Existence of the regime shift",
        "kind": "select",
        "choices": [
          "Speculative",
          "Contested",
          "Well established",
          "Proposed",
          "Unknown"
        ]
      },
      {
        "name": "confidence_mechanism",
        "label": "Confidence: Mechanism underlying the regime shift",
        "kind": "select",
        "choices": [
          "Speculative",
          "Contested",
          "Well established",
          "Proposed",
          "Unknown"
        ]
      },
      {
        "name": "year_or_duration",
        "label": "Year or duration",
        "kind": "text",
        "help": "Use YYYY if only the starting year is known, or YYYY to YYYY for a duration (e.g. 1990 to 2005).",
        "maxLength": 12
      }
    ]
  },
  {
    "id": "references",
    "title": "Thresholds and references",
    "fields": [
      {
        "name": "threshold_variable",
        "label": "Threshold variable",
        "kind": "text",
        "help": "Variable on which a threshold or tipping point is reported (e.g. temperature or dissolved oxygen). Separate multiple variables with commas.",
        "maxLength": 1000
      },
      {
        "name": "threshold_value",
        "label": "Threshold value",
        "kind": "text",
        "help": "Value for each variable, if reported (e.g. 0.5). Use decimal points and keep values in the same order as the variables.",
        "maxLength": 1000
      },
      {
        "name": "threshold_units",
        "label": "Threshold units",
        "kind": "text",
        "help": "Units for each threshold (e.g. degrees Celsius or Kelvin), in the same order as the variables.",
        "maxLength": 1000
      },
      {
        "name": "reference_text",
        "label": "Reference: text",
        "kind": "textarea",
        "help": "If no DOI is available, paste a complete reference, preferably in APA format. For multiple references, use matching IDs in both fields: (#1) … (#2) … .",
        "maxLength": 15000
      },
      {
        "name": "reference_doi",
        "label": "Reference: DOI or link",
        "kind": "textarea",
        "help": "Use a full https://doi.org/ link, an OpenAlex link, or another source link. For multiple references, use matching IDs in both fields: (#1) … (#2) … .",
        "maxLength": 10000
      }
    ]
  },
  {
    "id": "analysis",
    "title": "Regime shift analysis",
    "description": "Optional detailed case study narrative for explaining the regimes, causes, impacts, and management options to a general audience.",
    "optional": true,
    "fields": [
      {
        "name": "introduction",
        "label": "Introduction",
        "kind": "textarea",
        "help": "Where is the case located? How big is it (km²)? What are the key features, how connected or isolated is it, and when did the regime shift take place? Maximum 200 words.",
        "maxLength": 15000
      },
      {
        "name": "alternate_regimes",
        "label": "Alternate regimes",
        "kind": "textarea",
        "help": "Describe the two or more observed regimes and their key features. For each regime, give its name and describe what is seen in the field. Include key references. Aim for about 300 words.",
        "maxLength": 15000
      },
      {
        "name": "drivers_causes",
        "label": "Drivers and causes of the regime shift",
        "kind": "textarea",
        "help": "For the shift from Regime 1 to Regime 2, describe the main causes, then other important causes. Where applicable, repeat for the shift from Regime 2 to Regime 1. Include key references. Aim for about 300 words.",
        "maxLength": 15000
      },
      {
        "name": "shift_mechanism",
        "label": "How the regime shift worked",
        "kind": "textarea",
        "help": "In lay terms, explain how drivers and feedbacks caused the shift. Describe the conditions and feedbacks maintaining Regime 1, how drivers crossed thresholds into Regime 2, and the feedbacks maintaining Regime 2 and making it difficult to reverse. Include key references. Maximum 400 words per shift.",
        "maxLength": 15000
      },
      {
        "name": "impacts_narrative",
        "label": "Impacts on ecosystem services and human well-being",
        "kind": "textarea",
        "help": "Which ecosystem services were lost or gained, and who benefited or lost? Cover provisioning, regulating, and cultural services and human well-being. Where applicable, cover both shift directions. Maximum 200 words per shift.",
        "maxLength": 15000
      },
      {
        "name": "management_options",
        "label": "Management options",
        "kind": "textarea",
        "help": "Describe actions taken to prevent an undesirable shift, then actions taken to restore or encourage a desirable regime. Include management interventions that maintain desirable regimes or reduce resilience to enable restoration. Maximum 300 words.",
        "maxLength": 15000
      },
      {
        "name": "diagrams_photos",
        "label": "Diagrams and photos",
        "kind": "textarea",
        "help": "Suggest diagrams or photographs and include links to Creative Commons resources that can be freely distributed. No file uploads are collected.",
        "maxLength": 10000
      },
      {
        "name": "observations_comments",
        "label": "Observations or comments",
        "kind": "textarea",
        "help": "Any remarks that would help researchers code this case study.",
        "maxLength": 15000
      }
    ]
  }
];

export const fields = sections.flatMap(section => section.fields);
