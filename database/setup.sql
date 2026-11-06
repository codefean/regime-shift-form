begin;
create function public.valid_rsdb_choices(items text[], allowed text[]) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(array_ndims(items) = 1 and cardinality(items) between 1 and cardinality(allowed)
    and array_position(items, null) is null and items <@ allowed, false);
$$;
create table public.regime_shift_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  entry_date date not null,
  case_study_name text not null check (length(btrim(case_study_name)) >= 1 and length(case_study_name) <= 300),
  main_contributor text not null check (length(btrim(main_contributor)) >= 1 and length(main_contributor) <= 1000),
  other_contributors text check (length(other_contributors) <= 1000),
  summary text check (length(summary) <= 5000),
  regime_shift_types text[] not null check (public.valid_rsdb_choices(regime_shift_types, array['Arctic benthos borealisation','Arctic sea-ice loss','Bivalves collapse','Bush encroachment','Common pool resource harvesting','Coniferous to deciduous forest','Coral transitions','Fisheries collapse','Floating plants','Forest to savanna','Freshwater eutrophication','Greenland ice sheet collapse','Hypoxia','Kelp transitions','Mangroves transitions','Marine eutrophication','Marine food webs','Moonson','Peatland transitions','Primary production Arctic Ocean','River channel change','Salt marshes to tidal flats','Seagrass transitions','Soil salinization','Sprawling vs compact city','Steppe to tundra','Thermohaline circulation','Thermokarst lakes','Tundra to forest','West Antarctic ice sheet collapse','Proposed & new type','To be determined','Unknown']::text[])),
  regime_shift_type_other text check (length(regime_shift_type_other) <= 1000),
  ecosystem_types text[] check (ecosystem_types is null or public.valid_rsdb_choices(ecosystem_types, array['Marine & coastal','Freshwater lakes & rivers','Temperate & boreal forest','Tropical forests','Moist savannas & woodlands','Drylands & deserts (below ~500mm rainfall/year)','Mediterranean shrub (Fynbos)','Grasslands','Tundra','Rock & ice','Agro-ecosystems','Planetary']::text[])),
  land_uses text[] check (land_uses is null or public.valid_rsdb_choices(land_uses, array['Urban','Small-scale subsistence crop cultivation','Large-scale commercial crop cultivation','Intensive livestock production (e.g. feedlots, dairies)','Extensive livestock production (natural rangelands)','Timber production','Fisheries','Mining','Conservation','Tourism']::text[])),
  spatial_scale text check (spatial_scale = any(array['Local/landscape (e.g. lake, catchment, community)','National (country)','Sub-continental (e.g. southern Africa, Amazon basin)','Global']::text[])),
  continents_oceans text[] check (continents_oceans is null or public.valid_rsdb_choices(continents_oceans, array['Africa','Antarctica','Asia','Australia & New Zealand','Europe','North America','Central America','South America','Arctic Ocean','Atlantic Ocean','Indian Ocean','Pacific Ocean','Southern Ocean']::text[])),
  region text check (length(region) <= 1000),
  countries text check (length(countries) <= 1000),
  location text check (length(location) <= 300),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  direct_drivers text[] check (direct_drivers is null or public.valid_rsdb_choices(direct_drivers, array['Vegetation conversion and habitat fragmentation','Harvest and resource consumption','External inputs (e.g. fertilizers, pest control, irrigation)','Adoption of new technology (e.g. new fishing nets)','Infrastructure development (e.g. roads, pipelines)','Species introduction or removal','Disease','Soil erosion & land degradation','Environmental shocks (e.g. fire, floods, droughts)','Global climate change']::text[])),
  ecosystem_processes text[] check (ecosystem_processes is null or public.valid_rsdb_choices(ecosystem_processes, array['Soil formation','Primary production','Nutrient cycling','Water cycling']::text[])),
  provisioning_services text[] check (provisioning_services is null or public.valid_rsdb_choices(provisioning_services, array['Freshwater','Food crops','Livestock','Fisheries','Wild animal and plant products','Timber','Woodfuel','Feed, fuel and fiber crops','Hydropower']::text[])),
  regulating_services text[] check (regulating_services is null or public.valid_rsdb_choices(regulating_services, array['Air quality regulation','Climate regulation','Water purification','Water regulation','Regulation of soil erosion','Pest & disease regulation','Pollination','Natural hazard regulation']::text[])),
  cultural_services text[] check (cultural_services is null or public.valid_rsdb_choices(cultural_services, array['Recreation','Aesthetic values','Knowledge and educational values','Spiritual and religious']::text[])),
  human_wellbeing text[] check (human_wellbeing is null or public.valid_rsdb_choices(human_wellbeing, array['Food and nutrition','Health (e.g. toxins, disease)','Livelihoods and economic activity','Security of housing & infrastructure','Aesthetic and recreational values','Cultural identity','Social conflict','No direct impact']::text[])),
  sdgs text[] check (sdgs is null or public.valid_rsdb_choices(sdgs, array['No poverty','Zero hunger','Good health and well-being','Quality education','Gender equality','Clean water and sanitation','Affordable and clean energy','Decent work and economic growth','Industry, innovation & infrastructure','Reduced inequalities','Sustainable cities and communities','Responsible consumption and production','Climate action','Life below water','Life on land','Peace, justice and strong institutions','Partnerships for the goals']::text[])),
  time_scales text[] check (time_scales is null or public.valid_rsdb_choices(time_scales, array['Weeks','Months','Years','Decades','Centuries','Unknown']::text[])),
  reversibility text check (reversibility = any(array['Irreversible (on 100 year time scale)','Hysteretic (difficult to reverse)','Readily reversible','Unknown']::text[])),
  evidence text[] check (evidence is null or public.valid_rsdb_choices(evidence, array['Models','Paleo-observation','Contemporary observations','Experiments','Other']::text[])),
  confidence_existence text check (confidence_existence = any(array['Speculative','Contested','Well established','Proposed','Unknown']::text[])),
  confidence_mechanism text check (confidence_mechanism = any(array['Speculative','Contested','Well established','Proposed','Unknown']::text[])),
  year_or_duration text check (length(year_or_duration) <= 12),
  threshold_variable text check (length(threshold_variable) <= 1000),
  threshold_value text check (length(threshold_value) <= 1000),
  threshold_units text check (length(threshold_units) <= 1000),
  reference_text text check (length(reference_text) <= 15000),
  reference_doi text check (length(reference_doi) <= 10000),
  introduction text check (length(introduction) <= 15000),
  alternate_regimes text check (length(alternate_regimes) <= 15000),
  drivers_causes text check (length(drivers_causes) <= 15000),
  shift_mechanism text check (length(shift_mechanism) <= 15000),
  impacts_narrative text check (length(impacts_narrative) <= 15000),
  management_options text check (length(management_options) <= 15000),
  diagrams_photos text check (length(diagrams_photos) <= 10000),
  observations_comments text check (length(observations_comments) <= 15000),
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  reviewer_notes text,
  schema_version integer not null default 1 check (schema_version = 1),
  constraint rsdb_coordinate_pair check ((latitude is null and longitude is null) or (latitude is not null and longitude is not null)),
  constraint rsdb_year_format check (year_or_duration is null or (
    year_or_duration ~ '^[0-9]{4}( to [0-9]{4})?$'
    and substring(year_or_duration from 1 for 4)::integer > 0
    and (length(year_or_duration) = 4 or substring(year_or_duration from 9 for 4)::integer >= substring(year_or_duration from 1 for 4)::integer)
  ))
);
alter table public.regime_shift_submissions enable row level security;
revoke all on public.regime_shift_submissions from public, anon, authenticated;
grant insert (entry_date,case_study_name,main_contributor,other_contributors,summary,regime_shift_types,regime_shift_type_other,ecosystem_types,land_uses,spatial_scale,continents_oceans,region,countries,location,latitude,longitude,direct_drivers,ecosystem_processes,provisioning_services,regulating_services,cultural_services,human_wellbeing,sdgs,time_scales,reversibility,evidence,confidence_existence,confidence_mechanism,year_or_duration,threshold_variable,threshold_value,threshold_units,reference_text,reference_doi,introduction,alternate_regimes,drivers_causes,shift_mechanism,impacts_narrative,management_options,diagrams_photos,observations_comments) on public.regime_shift_submissions to anon;
create policy "Public case studies enter review" on public.regime_shift_submissions
  for insert to anon with check (review_status = 'pending' and reviewer_notes is null and schema_version = 1);
notify pgrst, 'reload schema';
commit;
