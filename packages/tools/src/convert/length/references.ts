import { lengthFactors, type LengthFactor } from "./factors.js";

export type LengthReference = {
  id: string;
  name: string;
  plural: string;
  meters: number;
  group: string;
  measurement: "body length" | "height" | "length" | "span";
  qualifier: string;
  source: string;
  sourceTitle: string;
  aliases: string[];
};

const references: LengthReference[] = [
  {
    id: "spacex-starship-v3",
    name: "SpaceX Starship V3 launch system",
    plural: "SpaceX Starship V3 launch systems",
    meters: 124.4,
    group: "Real spacecraft",
    measurement: "height",
    qualifier: "Starship V3 and Super Heavy, fully stacked (2026)",
    source:
      "https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf",
    sourceTitle: "SpaceX EU Prospectus",
    aliases: ["Space X", "Starship", "Super Heavy"],
  },
  {
    id: "saturn-v",
    name: "Saturn V",
    plural: "Saturn V rockets",
    meters: 111,
    group: "Real spacecraft",
    measurement: "height",
    qualifier: "Complete launch vehicle",
    source:
      "https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-grades-5-8/",
    sourceTitle: "NASA: What Was the Saturn V?",
    aliases: ["Apollo rocket"],
  },
  {
    id: "international-space-station",
    name: "International Space Station",
    plural: "International Space Stations",
    meters: 109,
    group: "Real spacecraft",
    measurement: "span",
    qualifier: "End-to-end truss span",
    source:
      "https://www.nasa.gov/wp-content/uploads/2024/12/iss-calendar-2025-58383a.pdf",
    sourceTitle: "NASA International Space Station calendar",
    aliases: ["ISS", "space station"],
  },
  {
    id: "enterprise-d",
    name: "USS Enterprise-D",
    plural: "USS Enterprise-D starships",
    meters: 641,
    group: "Star Trek",
    measurement: "length",
    qualifier: "Galaxy-class, Prime timeline",
    source: "https://memory-alpha.fandom.com/wiki/Galaxy_class",
    sourceTitle: "Memory Alpha: Galaxy class",
    aliases: ["Enterprise", "NCC-1701-D", "Galaxy class"],
  },
  {
    id: "millennium-falcon",
    name: "Millennium Falcon",
    plural: "Millennium Falcons",
    meters: 34.75,
    group: "Star Wars",
    measurement: "length",
    qualifier: "Current Star Wars Databank value",
    source: "https://www.starwars.com/databank/millennium-falcon",
    sourceTitle: "Star Wars Databank: Millennium Falcon",
    aliases: ["Falcon", "YT-1300"],
  },
  {
    id: "imperial-star-destroyer",
    name: "Imperial Star Destroyer",
    plural: "Imperial Star Destroyers",
    meters: 1600,
    group: "Star Wars",
    measurement: "length",
    qualifier: "Imperial-class Star Destroyer",
    source: "https://www.starwars.com/databank/imperial-star-destroyer",
    sourceTitle: "Star Wars Databank: Imperial Star Destroyer",
    aliases: ["Star Destroyer", "ISD"],
  },
  {
    id: "sdf-1-macross",
    name: "SDF-1 Macross",
    plural: "SDF-1 Macross ships",
    meters: 1210,
    group: "Manga & Anime",
    measurement: "length",
    qualifier: "Super Dimension Fortress One",
    source: "https://robotech.com/roboverse/mecha/sdf-1",
    sourceTitle: "Robotech: SDF-1",
    aliases: ["Macross", "Super Dimension Fortress"],
  },
  {
    id: "rx-78-2-gundam",
    name: "RX-78-2 Gundam",
    plural: "RX-78-2 Gundams",
    meters: 18,
    group: "Manga & Anime",
    measurement: "height",
    qualifier: "Official head height",
    source:
      "https://www.english.hobbyjapan.co.jp/_files/ugd/37bf6a_9039592552f742aeb448bd0a8e3b56e1.pdf",
    sourceTitle: "Hobby Japan: RX-78-2 Gundam guide",
    aliases: ["Gundam", "RX78"],
  },
  {
    id: "zoe-jehuty",
    name: "Jehuty (Zone of the Enders)",
    plural: "Jehuty Orbital Frames",
    meters: 20,
    group: "Games",
    measurement: "height",
    qualifier:
      "Approximate visual-scale estimate; Konami does not publish a canonical height",
    source: "https://www.konami.com/games/zoe_hd/en_us/characters/anubis.html",
    sourceTitle: "Konami: Zone of the Enders HD Collection",
    aliases: ["ZOE Jehuty", "Orbital Frame", "Zone of the Enders"],
  },
  {
    id: "zoe-zakat",
    name: "Zakat (Zone of the Enders)",
    plural: "Zakat Orbital Frames",
    meters: 100,
    group: "Games",
    measurement: "height",
    qualifier:
      "Approximate visual-scale estimate; Konami describes Zakat as a large Orbital Frame but does not publish dimensions",
    source: "https://www.konami.com/games/zoe_hd/en_us/characters/anubis.html",
    sourceTitle: "Konami: Zone of the Enders HD Collection",
    aliases: ["ZOE Zakat", "Orbital Frame", "Zone of the Enders"],
  },
  {
    id: "azzam-yacht",
    name: "Azzam superyacht",
    plural: "Azzam superyachts",
    meters: 180.61,
    group: "Yachts",
    measurement: "length",
    qualifier: "Overall length; Guinness largest-superyacht record",
    source:
      "https://www.guinnessworldrecords.com/world-records/736364-largest-superyacht",
    sourceTitle: "Guinness World Records: largest superyacht",
    aliases: ["largest yacht", "superyacht"],
  },
  {
    id: "uss-gerald-r-ford",
    name: "USS Gerald R. Ford",
    plural: "Gerald R. Ford-class aircraft carriers",
    meters: 332.8416,
    group: "Aircraft carriers",
    measurement: "length",
    qualifier: "Ford-class overall length of 1,092 ft",
    source:
      "https://www.navy.mil/Press-Office/News-Stories/display-news/Article/3142415/keel-laying-commemorated-for-third-ship-in-gerald-r-ford-class-the-future-uss-e/",
    sourceTitle: "United States Navy: Gerald R. Ford class",
    aliases: ["CVN-78", "Ford class", "US aircraft carrier"],
  },
  {
    id: "fujian-aircraft-carrier",
    name: "Fujian aircraft carrier",
    plural: "Fujian aircraft carriers",
    meters: 316,
    group: "Aircraft carriers",
    measurement: "length",
    qualifier:
      "Approximate overall flight-deck length measured from public imagery",
    source:
      "https://www.congress.gov/crs_external_products/RL/PDF/RL33153/RL33153.266.pdf",
    sourceTitle: "Congressional Research Service: China naval modernization",
    aliases: ["Type 003", "CV-18", "Chinese aircraft carrier"],
  },
  {
    id: "blue-whale",
    name: "Blue whale",
    plural: "blue whales",
    meters: 30,
    group: "Large animals",
    measurement: "body length",
    qualifier: "Approximate maximum adult length",
    source:
      "https://ocean.si.edu/ocean-life/marine-mammals/what-largest-whale-cetacea-size-comparison-chart",
    sourceTitle: "Smithsonian Ocean: largest whales",
    aliases: ["Balaenoptera musculus", "largest animal"],
  },
  {
    id: "sperm-whale",
    name: "Sperm whale",
    plural: "sperm whales",
    meters: 20,
    group: "Large animals",
    measurement: "body length",
    qualifier: "Approximate maximum adult male length",
    source: "https://ocean.si.edu/ocean-life/marine-mammals/whales",
    sourceTitle: "Smithsonian Ocean: whales and dolphins",
    aliases: ["Physeter macrocephalus"],
  },
  {
    id: "whale-shark",
    name: "Whale shark",
    plural: "whale sharks",
    meters: 20,
    group: "Large animals",
    measurement: "body length",
    qualifier: "Exceptional maximum; most are smaller",
    source: "https://sanctuaries.noaa.gov/education/teachers/whale-sharks.html",
    sourceTitle: "NOAA: Whale Sharks of Hawai‘i",
    aliases: ["Rhincodon typus", "largest fish"],
  },
  {
    id: "giraffe",
    name: "Giraffe",
    plural: "giraffes",
    meters: 5.5,
    group: "Large animals",
    measurement: "height",
    qualifier: "Representative adult height",
    source: "https://movementoflife.si.edu/species/giraffe/",
    sourceTitle: "Smithsonian Movement of Life: giraffe",
    aliases: ["Giraffa"],
  },
  {
    id: "asian-elephant",
    name: "Asian elephant",
    plural: "Asian elephants",
    meters: 3.8,
    group: "Large animals",
    measurement: "height",
    qualifier: "Upper adult shoulder height",
    source: "https://nationalzoo.si.edu/animals/asian-elephant",
    sourceTitle: "Smithsonian National Zoo: Asian elephant",
    aliases: ["Elephas maximus", "elephant"],
  },
  {
    id: "ruby-throated-hummingbird",
    name: "Ruby-throated hummingbird",
    plural: "ruby-throated hummingbirds",
    meters: 0.08,
    group: "Small animals",
    measurement: "body length",
    qualifier: "Representative midpoint of the 7–9 cm adult range",
    source: "https://nationalzoo.si.edu/animals/ruby-throated-hummingbird",
    sourceTitle: "Smithsonian National Zoo: ruby-throated hummingbird",
    aliases: ["hummingbird", "Archilochus colubris"],
  },
  {
    id: "tiny-goby",
    name: "Tiny goby",
    plural: "tiny gobies",
    meters: 0.0127,
    group: "Small animals",
    measurement: "body length",
    qualifier: "Approximate adult upper length of one-half inch",
    source:
      "https://www.fisheries.noaa.gov/national/outreach-and-education/fun-facts-about-fascinating-fish",
    sourceTitle: "NOAA Fisheries: fascinating fish",
    aliases: ["smallest fish", "goby"],
  },
  {
    id: "tardigrade",
    name: "Tardigrade",
    plural: "tardigrades",
    meters: 0.0005,
    group: "Small animals",
    measurement: "body length",
    qualifier: "Typical fully grown length; species vary",
    source:
      "https://www.ox.ac.uk/news/2021-09-28-the-physics-behind-a-water-bear-s-lumbering-gait",
    sourceTitle: "University of Oxford: water bear locomotion",
    aliases: ["water bear"],
  },
];

export const lengthReferences: Readonly<Record<string, LengthReference>> =
  Object.fromEntries(references.map((reference) => [reference.id, reference]));

export const lengthReferenceFactors: Readonly<Record<string, LengthFactor>> =
  Object.fromEntries(
    references.map((reference) => [
      `reference:${reference.id}`,
      {
        name: reference.name,
        factor: reference.meters,
        cite: reference.source,
      },
    ]),
  );

export const lengthConversionFactors = Object.freeze({
  ...lengthFactors,
  ...lengthReferenceFactors,
});

export const lengthConversionUnitIds = Object.freeze(
  Object.keys(lengthConversionFactors),
);

export const isLengthConversionUnit = (value: unknown): value is string =>
  typeof value === "string" && Object.hasOwn(lengthConversionFactors, value);
