const BIPM_SI = "https://www.bipm.org/en/publications/si-brochure";
const NIST_LENGTH = "https://www.nist.gov/pml/owm/si-units-length";
const NIST_CONVERSIONS =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";
const NIST_SURVEY_FOOT =
  "https://www.nist.gov/pml/us-surveyfoot/revised-unit-conversion-factors";
const NIST_CONSTANTS = "https://physics.nist.gov/cuu/Constants/";
const IAU_UNITS = "https://www.iau.org/publications/proceedings_rules/units/";
const JAPANESE_UNITS = "https://www.ndl.go.jp/exposition/e/s3/doryou.html";
const CHINESE_UNITS =
  "https://en.wikipedia.org/wiki/Chinese_units_of_measurement";
const THAI_UNITS = "https://en.wikipedia.org/wiki/Thai_units_of_measurement";
const HISTORICAL_UNITS =
  "https://en.wikipedia.org/wiki/List_of_unusual_units_of_measurement";

export type LengthFactor = {
  name: string;
  factor: number;
  cite: string;
};

const siPrefixes = [
  ["q", "Quecto", 1e-30],
  ["r", "Ronto", 1e-27],
  ["y", "Yocto", 1e-24],
  ["z", "Zepto", 1e-21],
  ["a", "Atto", 1e-18],
  ["f", "Femto", 1e-15],
  ["p", "Pico", 1e-12],
  ["n", "Nano", 1e-9],
  ["u", "Micro", 1e-6],
  ["m", "Milli", 1e-3],
  ["c", "Centi", 1e-2],
  ["d", "Deci", 1e-1],
  ["", "", 1],
  ["da", "Deca", 1e1],
  ["h", "Hecto", 1e2],
  ["k", "Kilo", 1e3],
  ["M", "Mega", 1e6],
  ["G", "Giga", 1e9],
  ["T", "Tera", 1e12],
  ["P", "Peta", 1e15],
  ["E", "Exa", 1e18],
  ["Z", "Zetta", 1e21],
  ["Y", "Yotta", 1e24],
  ["R", "Ronna", 1e27],
  ["Q", "Quetta", 1e30],
] as const;

const siMeterFactors = Object.fromEntries(
  siPrefixes.map(([symbol, prefix, factor]) => [
    `${symbol}m`,
    {
      name: prefix ? `${prefix}meter` : "Meter",
      factor,
      cite: BIPM_SI,
    },
  ]),
) as Record<string, LengthFactor>;

const inch = 0.0254;
const foot = 0.3048;
const yard = 3 * foot;
const mile = 5280 * foot;
const usSurveyFoot = 1200 / 3937;
const astronomicalUnit = 149_597_870_700;
const speedOfLight = 299_792_458;
const japaneseShaku = 10 / 33;
const chineseChi = 1 / 3;

// Every factor is the number of meters in one unit. Names identify regional or
// historical variants where a shared unit name does not have one universal size.
export const lengthFactors: Readonly<Record<string, LengthFactor>> = {
  ...siMeterFactors,

  // Atomic and scientific scales
  "planck-length": {
    name: "Planck length",
    factor: 1.616255e-35,
    cite: NIST_CONSTANTS,
  },
  "classical-electron-radius": {
    name: "Classical electron radius",
    factor: 2.8179403262e-15,
    cite: NIST_CONSTANTS,
  },
  fermi: { name: "Fermi", factor: 1e-15, cite: BIPM_SI },
  "electron-compton-wavelength": {
    name: "Electron Compton wavelength",
    factor: 2.42631023867e-12,
    cite: NIST_CONSTANTS,
  },
  bohr: {
    name: "Bohr radius",
    factor: 5.29177210903e-11,
    cite: NIST_CONSTANTS,
  },
  angstrom: {
    name: "Angstrom",
    factor: 1e-10,
    cite: NIST_CONVERSIONS,
  },
  micron: { name: "Micron", factor: 1e-6, cite: BIPM_SI },

  // International, US customary, and nautical units
  mil: {
    name: "Mil (thousandth of an inch)",
    factor: inch / 1000,
    cite: NIST_CONVERSIONS,
  },
  barleycorn: {
    name: "Barleycorn",
    factor: inch / 3,
    cite: HISTORICAL_UNITS,
  },
  in: { name: "Inch", factor: inch, cite: NIST_LENGTH },
  hand: {
    name: "Hand",
    factor: 4 * inch,
    cite: NIST_CONVERSIONS,
  },
  link: {
    name: "Link (Gunter's)",
    factor: 0.201168,
    cite: NIST_CONVERSIONS,
  },
  ft: { name: "Foot", factor: foot, cite: NIST_LENGTH },
  yd: { name: "Yard", factor: yard, cite: NIST_CONVERSIONS },
  fathom: {
    name: "Fathom (international)",
    factor: 6 * foot,
    cite: NIST_CONVERSIONS,
  },
  rod: {
    name: "Rod, pole, or perch",
    factor: 16.5 * foot,
    cite: NIST_CONVERSIONS,
  },
  chain: {
    name: "Chain (Gunter's)",
    factor: 66 * foot,
    cite: NIST_CONVERSIONS,
  },
  furlong: {
    name: "Furlong",
    factor: 660 * foot,
    cite: NIST_CONVERSIONS,
  },
  mi: {
    name: "Mile (international)",
    factor: mile,
    cite: NIST_LENGTH,
  },
  "statute-league": {
    name: "League (statute)",
    factor: 3 * mile,
    cite: NIST_CONVERSIONS,
  },
  nmi: {
    name: "Nautical mile (international)",
    factor: 1852,
    cite: NIST_CONVERSIONS,
  },
  "cable-international": {
    name: "Cable length (international)",
    factor: 185.2,
    cite: NIST_CONVERSIONS,
  },
  "cable-imperial": {
    name: "Cable length (imperial)",
    factor: 608 * foot,
    cite: NIST_CONVERSIONS,
  },
  "admiralty-nautical-mile": {
    name: "Nautical mile (Admiralty)",
    factor: 6080 * foot,
    cite: NIST_CONVERSIONS,
  },
  "nautical-league": {
    name: "League (nautical)",
    factor: 3 * 1852,
    cite: NIST_CONVERSIONS,
  },
  "scandinavian-mile": {
    name: "Scandinavian mile (modern)",
    factor: 10_000,
    cite: HISTORICAL_UNITS,
  },

  // Legacy US survey units
  "ft-us": {
    name: "Foot (US survey, legacy)",
    factor: usSurveyFoot,
    cite: NIST_SURVEY_FOOT,
  },
  "link-us": {
    name: "Link (US survey, legacy)",
    factor: usSurveyFoot * 0.66,
    cite: NIST_SURVEY_FOOT,
  },
  "rod-us": {
    name: "Rod (US survey, legacy)",
    factor: usSurveyFoot * 16.5,
    cite: NIST_SURVEY_FOOT,
  },
  "chain-us": {
    name: "Chain (US survey, legacy)",
    factor: usSurveyFoot * 66,
    cite: NIST_SURVEY_FOOT,
  },
  "furlong-us": {
    name: "Furlong (US survey, legacy)",
    factor: usSurveyFoot * 660,
    cite: NIST_SURVEY_FOOT,
  },
  "mi-us": {
    name: "Mile (US survey, legacy)",
    factor: usSurveyFoot * 5280,
    cite: NIST_SURVEY_FOOT,
  },

  // Typography, publishing, displays, and equipment
  "css-px": {
    name: "CSS reference pixel",
    factor: inch / 96,
    cite: "https://www.w3.org/TR/css-values-4/#absolute-lengths",
  },
  "point-dtp": {
    name: "Point (DTP/PostScript)",
    factor: inch / 72,
    cite: NIST_CONVERSIONS,
  },
  "pica-dtp": {
    name: "Pica (DTP/PostScript)",
    factor: inch / 6,
    cite: NIST_CONVERSIONS,
  },
  twip: {
    name: "Twip",
    factor: inch / 1440,
    cite: HISTORICAL_UNITS,
  },
  "tex-point": {
    name: "Point (TeX)",
    factor: inch / 72.27,
    cite: "https://tug.org/TUGboat/tb27-2/tb87hagen-dimensions.pdf",
  },
  "didot-point": {
    name: "Didot point",
    factor: 0.0003759715104,
    cite: HISTORICAL_UNITS,
  },
  cicero: {
    name: "Cicero",
    factor: 12 * 0.0003759715104,
    cite: HISTORICAL_UNITS,
  },
  "rack-unit": {
    name: "Rack unit (U)",
    factor: 1.75 * inch,
    cite: "https://en.wikipedia.org/wiki/Rack_unit",
  },

  // Astronomical scales
  "light-second": {
    name: "Light-second",
    factor: speedOfLight,
    cite: IAU_UNITS,
  },
  "light-minute": {
    name: "Light-minute",
    factor: speedOfLight * 60,
    cite: IAU_UNITS,
  },
  "light-hour": {
    name: "Light-hour",
    factor: speedOfLight * 3600,
    cite: IAU_UNITS,
  },
  "light-day": {
    name: "Light-day",
    factor: speedOfLight * 86_400,
    cite: IAU_UNITS,
  },
  "light-year": {
    name: "Light-year",
    factor: 9_460_730_472_580_800,
    cite: IAU_UNITS,
  },
  au: {
    name: "Astronomical unit",
    factor: astronomicalUnit,
    cite: IAU_UNITS,
  },
  pc: {
    name: "Parsec",
    factor: (648_000 / Math.PI) * astronomicalUnit,
    cite: IAU_UNITS,
  },
  kpc: {
    name: "Kiloparsec",
    factor: (648_000 / Math.PI) * astronomicalUnit * 1e3,
    cite: IAU_UNITS,
  },
  Mpc: {
    name: "Megaparsec",
    factor: (648_000 / Math.PI) * astronomicalUnit * 1e6,
    cite: IAU_UNITS,
  },
  Gpc: {
    name: "Gigaparsec",
    factor: (648_000 / Math.PI) * astronomicalUnit * 1e9,
    cite: IAU_UNITS,
  },
  "lunar-distance": {
    name: "Mean Earth–Moon distance",
    factor: 384_400_000,
    cite: "https://science.nasa.gov/moon/facts/",
  },
  "earth-radius": {
    name: "Mean Earth radius",
    factor: 6_371_008.8,
    cite: "https://www.nist.gov/pml/owm/si-units-length",
  },
  "solar-radius": {
    name: "Nominal solar radius",
    factor: 695_700_000,
    cite: IAU_UNITS,
  },

  // Modern and traditional Japanese units
  "rin-jp": {
    name: "Rin (Japanese)",
    factor: japaneseShaku / 1000,
    cite: JAPANESE_UNITS,
  },
  "bu-jp": {
    name: "Bu (Japanese)",
    factor: japaneseShaku / 100,
    cite: JAPANESE_UNITS,
  },
  "sun-jp": {
    name: "Sun (Japanese)",
    factor: japaneseShaku / 10,
    cite: JAPANESE_UNITS,
  },
  "shaku-jp": {
    name: "Shaku (Japanese)",
    factor: japaneseShaku,
    cite: JAPANESE_UNITS,
  },
  "ken-jp": {
    name: "Ken (Japanese)",
    factor: japaneseShaku * 6,
    cite: JAPANESE_UNITS,
  },
  "jo-jp-length": {
    name: "Jō (Japanese length)",
    factor: japaneseShaku * 10,
    cite: JAPANESE_UNITS,
  },
  "cho-jp-length": {
    name: "Chō (Japanese length)",
    factor: japaneseShaku * 360,
    cite: JAPANESE_UNITS,
  },
  "ri-jp": {
    name: "Ri (Japanese)",
    factor: japaneseShaku * 12_960,
    cite: JAPANESE_UNITS,
  },

  // Modern Chinese market units
  "hao-cn": {
    name: "Hao (Chinese market length)",
    factor: chineseChi / 10_000,
    cite: CHINESE_UNITS,
  },
  "li-cn-small": {
    name: "Li (Chinese market, small)",
    factor: chineseChi / 1000,
    cite: CHINESE_UNITS,
  },
  "fen-cn": {
    name: "Fen (Chinese market length)",
    factor: chineseChi / 100,
    cite: CHINESE_UNITS,
  },
  "cun-cn": {
    name: "Cun (Chinese market length)",
    factor: chineseChi / 10,
    cite: CHINESE_UNITS,
  },
  "chi-cn": {
    name: "Chi (Chinese market)",
    factor: chineseChi,
    cite: CHINESE_UNITS,
  },
  "zhang-cn": {
    name: "Zhang (Chinese market)",
    factor: chineseChi * 10,
    cite: CHINESE_UNITS,
  },
  "li-cn-distance": {
    name: "Li (Chinese distance, modern)",
    factor: 500,
    cite: CHINESE_UNITS,
  },
  "chi-tw": {
    name: "Chi (Taiwanese)",
    factor: 10 / 33,
    cite: CHINESE_UNITS,
  },
  "chek-hk": {
    name: "Chek (Hong Kong)",
    factor: 0.371475,
    cite: CHINESE_UNITS,
  },

  // Modern Thai traditional units
  "niu-th": {
    name: "Niu (Thai)",
    factor: 1 / 48,
    cite: THAI_UNITS,
  },
  "khuep-th": {
    name: "Khuep (Thai)",
    factor: 0.25,
    cite: THAI_UNITS,
  },
  "sok-th": {
    name: "Sok (Thai)",
    factor: 0.5,
    cite: THAI_UNITS,
  },
  "wa-th": { name: "Wa (Thai)", factor: 2, cite: THAI_UNITS },
  "sen-th": {
    name: "Sen (Thai)",
    factor: 40,
    cite: THAI_UNITS,
  },
  "yot-th": {
    name: "Yot (Thai)",
    factor: 16_000,
    cite: THAI_UNITS,
  },

  // Selected historical units with an identified convention
  vershok: {
    name: "Vershok (Russian imperial)",
    factor: 1.75 * inch,
    cite: HISTORICAL_UNITS,
  },
  arshin: {
    name: "Arshin (Russian imperial)",
    factor: 28 * inch,
    cite: HISTORICAL_UNITS,
  },
  sazhen: {
    name: "Sazhen (Russian imperial)",
    factor: 7 * foot,
    cite: HISTORICAL_UNITS,
  },
  verst: {
    name: "Verst (Russian imperial)",
    factor: 3500 * foot,
    cite: HISTORICAL_UNITS,
  },
  "ell-english": {
    name: "Ell (English)",
    factor: 45 * inch,
    cite: HISTORICAL_UNITS,
  },
  "ell-flemish": {
    name: "Ell (Flemish)",
    factor: 27 * inch,
    cite: HISTORICAL_UNITS,
  },
  "cubit-egyptian-common": {
    name: "Cubit (ancient Egyptian common, approximate)",
    factor: 0.45,
    cite: HISTORICAL_UNITS,
  },
  "cubit-egyptian-royal": {
    name: "Cubit (ancient Egyptian royal, approximate)",
    factor: 0.5235,
    cite: HISTORICAL_UNITS,
  },
  "foot-roman": {
    name: "Foot (Roman, approximate)",
    factor: 0.296,
    cite: HISTORICAL_UNITS,
  },
  "pace-roman": {
    name: "Pace (Roman, approximate)",
    factor: 1.48,
    cite: HISTORICAL_UNITS,
  },
  "mile-roman": {
    name: "Mile (Roman, approximate)",
    factor: 1480,
    cite: HISTORICAL_UNITS,
  },
  "vara-castilian": {
    name: "Vara (Castilian)",
    factor: 0.835905,
    cite: HISTORICAL_UNITS,
  },
  "vara-texas": {
    name: "Vara (Texas)",
    factor: (100 / 3) * inch,
    cite: HISTORICAL_UNITS,
  },
};

export const lengthUnitIds = Object.freeze(Object.keys(lengthFactors));

export const isLengthUnit = (value: unknown): value is string =>
  typeof value === "string" && Object.hasOwn(lengthFactors, value);
