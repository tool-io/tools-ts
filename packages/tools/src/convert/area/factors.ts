// Factors are square meters per unit. Definitions described as exact below
// are calculated from their defining linear unit instead of rounded tables.

const siCitation = "https://www.bipm.org/en/publications/si-brochure";
const nistCitation =
  "https://www.nist.gov/pml/us-surveyfoot/revised-unit-conversion-factors";
const nistHandbookCitation = "https://www.nist.gov/pml/owm/si-units-area";
const japaneseCitation = "https://snl.no/tsubo";
const tatamiCitation =
  "https://travel.rakuten.com/contents/usa/en-us/guide/tatami-guide/";
const thaiCitation = "https://en.wikipedia.org/wiki/Thai_units_of_measurement";
const chineseCitation = "https://en.wikipedia.org/wiki/Mu_(land)";
const indiaLandCitation =
  "https://www.egovstandards.gov.in/sites/default/files/2021-07/MDDS%20Demographic%20Ver%201.1.pdf";
const punjabLandCitation =
  "https://www.punjab-zameen.gov.pk/assets/documents/laws/Chapter%204.pdf";
const bangladeshLandCitation =
  "https://minland.gov.bd/pages/static-pages/694032ae35ce18e1c0560717";

const internationalFoot = 0.3048;
const internationalYard = 0.9144;
const internationalRod = 5.0292;
const internationalChain = 20.1168;
const internationalFurlong = 201.168;
const internationalMile = 1609.344;
const nauticalMile = 1852;
const usSurveyFoot = 1200 / 3937;
const usSurveyRod = usSurveyFoot * 16.5;
const usSurveyChain = usSurveyFoot * 66;
const usSurveyMile = usSurveyFoot * 5280;
const astronomicalUnit = 149_597_870_700;
const lightYear = 9_460_730_472_580_800;
const parsec = (648_000 / Math.PI) * astronomicalUnit;
const tsubo = 400 / 121;

export const measureFactors = {
  // SI square units
  sqqm: {
    name: "Square quectometer",
    factor: 1e-60,
    cite: siCitation,
  },
  sqrm: {
    name: "Square rontometer",
    factor: 1e-54,
    cite: siCitation,
  },
  sqym: {
    name: "Square yoctometer",
    factor: 1e-48,
    cite: siCitation,
  },
  sqzm: {
    name: "Square zeptometer",
    factor: 1e-42,
    cite: siCitation,
  },
  sqam: {
    name: "Square attometer",
    factor: 1e-36,
    cite: siCitation,
  },
  sqfm: {
    name: "Square femtometer",
    factor: 1e-30,
    cite: siCitation,
  },
  sqpm: {
    name: "Square picometer",
    factor: 1e-24,
    cite: siCitation,
  },
  sqnm: {
    name: "Square nanometer",
    factor: 1e-18,
    cite: siCitation,
  },
  squm: {
    name: "Square micrometer",
    factor: 1e-12,
    cite: siCitation,
  },
  sqmm: {
    name: "Square millimeter",
    factor: 1e-6,
    cite: siCitation,
  },
  sqcm: {
    name: "Square centimeter",
    factor: 1e-4,
    cite: siCitation,
  },
  sqdm: {
    name: "Square decimeter",
    factor: 1e-2,
    cite: siCitation,
  },
  sqm: {
    name: "Square meter",
    factor: 1,
    cite: siCitation,
  },
  sqdam: {
    name: "Square decameter",
    factor: 1e2,
    cite: siCitation,
  },
  sqhm: {
    name: "Square hectometer",
    factor: 1e4,
    cite: siCitation,
  },
  sqkm: {
    name: "Square kilometer",
    factor: 1e6,
    cite: siCitation,
  },
  sqMm: {
    name: "Square megameter",
    factor: 1e12,
    cite: siCitation,
  },
  sqGm: {
    name: "Square gigameter",
    factor: 1e18,
    cite: siCitation,
  },
  sqTm: {
    name: "Square terameter",
    factor: 1e24,
    cite: siCitation,
  },
  sqPm: {
    name: "Square petameter",
    factor: 1e30,
    cite: siCitation,
  },
  sqEm: {
    name: "Square exameter",
    factor: 1e36,
    cite: siCitation,
  },
  sqZm: {
    name: "Square zettameter",
    factor: 1e42,
    cite: siCitation,
  },
  sqYm: {
    name: "Square yottameter",
    factor: 1e48,
    cite: siCitation,
  },
  sqRm: {
    name: "Square ronnameter",
    factor: 1e54,
    cite: siCitation,
  },
  sqQm: {
    name: "Square quettameter",
    factor: 1e60,
    cite: siCitation,
  },

  // Metric land units
  centiare: {
    name: "Centiare",
    factor: 1,
    cite: nistHandbookCitation,
  },
  are: {
    name: "Are",
    factor: 100,
    cite: nistHandbookCitation,
  },
  decare: {
    name: "Decare",
    factor: 1000,
    cite: nistHandbookCitation,
  },
  hectare: {
    name: "Hectare",
    factor: 10_000,
    cite: nistHandbookCitation,
  },
  dunam: {
    name: "Dunam (metric)",
    factor: 1000,
    cite: "https://en.wikipedia.org/wiki/Dunam",
  },

  // Scientific and astronomical units
  sqangstrom: {
    name: "Square angstrom",
    factor: 1e-20,
    cite: siCitation,
  },
  attobarn: {
    name: "Attobarn",
    factor: 1e-46,
    cite: siCitation,
  },
  femtobarn: {
    name: "Femtobarn",
    factor: 1e-43,
    cite: siCitation,
  },
  picobarn: {
    name: "Picobarn",
    factor: 1e-40,
    cite: siCitation,
  },
  nanobarn: {
    name: "Nanobarn",
    factor: 1e-37,
    cite: siCitation,
  },
  microbarn: {
    name: "Microbarn",
    factor: 1e-34,
    cite: siCitation,
  },
  millibarn: {
    name: "Millibarn",
    factor: 1e-31,
    cite: siCitation,
  },
  barn: {
    name: "Barn",
    factor: 1e-28,
    cite: siCitation,
  },
  kilobarn: {
    name: "Kilobarn",
    factor: 1e-25,
    cite: siCitation,
  },
  megabarn: {
    name: "Megabarn",
    factor: 1e-22,
    cite: siCitation,
  },
  sqau: {
    name: "Square astronomical unit",
    factor: astronomicalUnit ** 2,
    cite: siCitation,
  },
  sqly: {
    name: "Square light-year",
    factor: lightYear ** 2,
    cite: siCitation,
  },
  sqpc: {
    name: "Square parsec",
    factor: parsec ** 2,
    cite: siCitation,
  },

  // International imperial and US customary units
  sqmil: {
    name: "Square mil",
    factor: 0.0000254 ** 2,
    cite: nistCitation,
  },
  circularmil: {
    name: "Circular mil",
    factor: (Math.PI / 4) * 0.0000254 ** 2,
    cite: nistCitation,
  },
  circularin: {
    name: "Circular inch",
    factor: (Math.PI / 4) * 0.0254 ** 2,
    cite: nistCitation,
  },
  sqin: {
    name: "Square inch",
    factor: 0.0254 ** 2,
    cite: nistCitation,
  },
  sqft: {
    name: "Square foot",
    factor: internationalFoot ** 2,
    cite: nistCitation,
  },
  sqyd: {
    name: "Square yard",
    factor: internationalYard ** 2,
    cite: nistCitation,
  },
  square: {
    name: "Square (building or roofing)",
    factor: 100 * internationalFoot ** 2,
    cite: nistHandbookCitation,
  },
  sqrod: {
    name: "Square rod, pole, or perch",
    factor: internationalRod ** 2,
    cite: nistHandbookCitation,
  },
  sqchain: {
    name: "Square chain",
    factor: internationalChain ** 2,
    cite: nistHandbookCitation,
  },
  rood: {
    name: "Rood",
    factor: 10_890 * internationalFoot ** 2,
    cite: nistHandbookCitation,
  },
  acre: {
    name: "Acre (international)",
    factor: 43_560 * internationalFoot ** 2,
    cite: nistCitation,
  },
  sqfurlong: {
    name: "Square furlong",
    factor: internationalFurlong ** 2,
    cite: nistHandbookCitation,
  },
  sqmi: {
    name: "Square mile",
    factor: internationalMile ** 2,
    cite: nistCitation,
  },
  section: {
    name: "Section (US land survey)",
    factor: internationalMile ** 2,
    cite: nistHandbookCitation,
  },
  township: {
    name: "Survey township",
    factor: 36 * internationalMile ** 2,
    cite: nistHandbookCitation,
  },
  sqleague: {
    name: "Square statute league",
    factor: 9 * internationalMile ** 2,
    cite: nistHandbookCitation,
  },
  sqnmi: {
    name: "Square nautical mile",
    factor: nauticalMile ** 2,
    cite: siCitation,
  },
  sqnleague: {
    name: "Square nautical league",
    factor: 9 * nauticalMile ** 2,
    cite: siCitation,
  },

  // Legacy US survey units. The survey foot was retired for new work in 2023.
  "sqft-us": {
    name: "Square US survey foot",
    factor: usSurveyFoot ** 2,
    cite: nistCitation,
  },
  "sqrod-us": {
    name: "Square US survey rod",
    factor: usSurveyRod ** 2,
    cite: nistCitation,
  },
  "sqchain-us": {
    name: "Square US survey chain",
    factor: usSurveyChain ** 2,
    cite: nistCitation,
  },
  "acre-us": {
    name: "US survey acre",
    factor: 43_560 * usSurveyFoot ** 2,
    cite: nistCitation,
  },
  "sqmi-us": {
    name: "Square US survey mile",
    factor: usSurveyMile ** 2,
    cite: nistCitation,
  },

  // Fixed regional land units
  sqwa: {
    name: "Square wa (Thailand)",
    factor: 4,
    cite: thaiCitation,
  },
  ngan: {
    name: "Ngan (Thailand)",
    factor: 400,
    cite: thaiCitation,
  },
  rai: {
    name: "Rai (Thailand)",
    factor: 1600,
    cite: thaiCitation,
  },
  tsubo: {
    name: "Tsubo or bu (Japan)",
    factor: tsubo,
    cite: japaneseCitation,
  },
  go: {
    name: "Gō (Japan)",
    factor: tsubo / 10,
    cite: japaneseCitation,
  },
  jo: {
    name: "Jō (traditional Japanese area)",
    factor: tsubo / 2,
    cite: japaneseCitation,
  },
  "tatami-real-estate": {
    name: "Tatami or jō (Japanese real-estate advertising)",
    factor: 1.62,
    cite: tatamiCitation,
  },
  "tatami-kyoma": {
    name: "Tatami, Kyōma or Honma (Kansai)",
    factor: 1.91 * 0.955,
    cite: tatamiCitation,
  },
  "tatami-rokuichima": {
    name: "Tatami, Roku-ichima (Chūgoku)",
    factor: 1.848 * 0.924,
    cite: "https://www.tatami.ca/faqs",
  },
  "tatami-chukyoma": {
    name: "Tatami, Chūkyōma or Ainoma (Nagoya)",
    factor: 1.82 * 0.91,
    cite: tatamiCitation,
  },
  "tatami-edoma": {
    name: "Tatami, Edoma or Kantōma (Tokyo)",
    factor: 1.76 * 0.88,
    cite: tatamiCitation,
  },
  "tatami-danchima": {
    name: "Tatami, Danchima (apartments)",
    factor: 1.7 * 0.85,
    cite: tatamiCitation,
  },
  "tatami-ryukyu": {
    name: "Tatami, Ryūkyū square mat",
    factor: 0.88 ** 2,
    cite: tatamiCitation,
  },
  "tatami-chashitsu-kirikomi": {
    name: "Tatami, chashitsu kirikomi",
    factor: 0.424 ** 2,
    cite: "https://www.tatami.ca/faqs",
  },
  se: {
    name: "Se (Japan)",
    factor: tsubo * 30,
    cite: japaneseCitation,
  },
  tan: {
    name: "Tan (Japan)",
    factor: tsubo * 300,
    cite: japaneseCitation,
  },
  cho: {
    name: "Chō (Japan)",
    factor: tsubo * 3000,
    cite: japaneseCitation,
  },
  ping: {
    name: "Ping (Taiwan)",
    factor: tsubo,
    cite: "https://en.wikipedia.org/wiki/Taiwanese_units_of_measurement",
  },
  pyeong: {
    name: "Pyeong (Korea)",
    factor: tsubo,
    cite: "https://en.wikipedia.org/wiki/Pyeong",
  },
  mu: {
    name: "Mu (China)",
    factor: 2000 / 3,
    cite: chineseCitation,
  },
  qing: {
    name: "Qing (China)",
    factor: 200_000 / 3,
    cite: chineseCitation,
  },
  cent: {
    name: "Cent (South Asian land)",
    factor: (43_560 * internationalFoot ** 2) / 100,
    cite: nistHandbookCitation,
  },
  decimal: {
    name: "Decimal (South Asian land)",
    factor: (43_560 * internationalFoot ** 2) / 100,
    cite: nistHandbookCitation,
  },
  guntha: {
    name: "Guntha",
    factor: (43_560 * internationalFoot ** 2) / 40,
    cite: nistHandbookCitation,
  },
  ground: {
    name: "Ground (South India)",
    factor: 2400 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "lessa-assam": {
    name: "Lessa (Assam)",
    factor: 144 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "katha-assam": {
    name: "Katha (Assam)",
    factor: 720 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "bigha-assam": {
    name: "Bigha (Assam)",
    factor: 2880 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "chatak-west-bengal": {
    name: "Chatak (West Bengal)",
    factor: 45 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "katha-west-bengal": {
    name: "Katha (West Bengal)",
    factor: 720 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "bigha-west-bengal": {
    name: "Bigha (West Bengal)",
    factor: 14_400 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "bigha-rajasthan-shahjahani": {
    name: "Bigha, Shahjahani jarib (Rajasthan)",
    factor: 27_225 * internationalFoot ** 2,
    cite: indiaLandCitation,
  },
  "katha-bangladesh": {
    name: "Katha (Bangladesh standard)",
    factor: 1338 / 20,
    cite: bangladeshLandCitation,
  },
  "bigha-bangladesh": {
    name: "Bigha (Bangladesh standard)",
    factor: 1338,
    cite: bangladeshLandCitation,
  },
  "marla-punjab": {
    name: "Marla (historic Punjab standard)",
    factor: 272.25 * internationalFoot ** 2,
    cite: punjabLandCitation,
  },
  "kanal-punjab": {
    name: "Kanal (historic Punjab standard)",
    factor: 5445 * internationalFoot ** 2,
    cite: punjabLandCitation,
  },
  "marla-pakistan-urban": {
    name: "Marla (Pakistan urban, 225 square feet)",
    factor: 225 * internationalFoot ** 2,
    cite: "https://en.wikipedia.org/wiki/Marla_(unit)",
  },
  "kanal-pakistan-urban": {
    name: "Kanal (Pakistan urban, 4,500 square feet)",
    factor: 4500 * internationalFoot ** 2,
    cite: "https://en.wikipedia.org/wiki/Kanal_(unit)",
  },
  feddan: {
    name: "Feddan (Egypt and Sudan)",
    factor: 4200.833333333333,
    cite: "https://en.wikipedia.org/wiki/Feddan",
  },
  cuerda: {
    name: "Cuerda (Puerto Rico)",
    factor: 3930.395625,
    cite: "https://en.wikipedia.org/wiki/Puerto_Rican_units_of_measurement",
  },
  "fanegada-castile": {
    name: "Fanegada (Castile, Spain)",
    factor: 6459.6,
    cite: "https://es.wikipedia.org/wiki/Hanegada",
  },
  "hanegada-valencia": {
    name: "Hanegada (Valencia, Spain)",
    factor: 831,
    cite: "https://es.wikipedia.org/wiki/Hanegada",
  },
  "fanegada-canary-islands": {
    name: "Fanegada (Canary Islands)",
    factor: 5248,
    cite: "https://es.wikipedia.org/wiki/Hanegada",
  },
  "fanegada-colombia": {
    name: "Fanegada, plaza, or cuadra (Colombia)",
    factor: 6400,
    cite: "https://es.wikipedia.org/wiki/Plaza_(unidad_de_superficie)",
  },
} as const;
