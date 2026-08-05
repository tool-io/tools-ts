// Factors are liters per unit. Exact customary factors are calculated from
// their defining gallon or linear unit instead of rounded conversion tables.

const siCitation = "https://www.bipm.org/en/publications/si-brochure";
const nistCitation =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8";
const nistVolumeCitation = "https://www.nist.gov/pml/owm/si-units-volume";
const imperialCitation =
  "https://www.gov.uk/weights-measures-and-packaging-the-law/units-of-measurement";
const japaneseCitation = "https://www.nippon.com/en/japan-data/h01488/";

const internationalFoot = 0.3048;
const internationalYard = 0.9144;
const internationalMile = 1609.344;
const usSurveyFoot = 1200 / 3937;
const usLiquidGallon = 3.785411784;
const usDryPint = 0.5506104713575;
const imperialGallon = 4.54609;
const astronomicalUnit = 149_597_870_700;
const lightYear = 9_460_730_472_580_800;
const parsec = (648_000 / Math.PI) * astronomicalUnit;
const japaneseSho = 2401 / 1331;

type Prefix = {
  factor: number;
  name: string;
  symbol: string;
};

const prefixes: Prefix[] = [
  { factor: 1e-30, name: "quecto", symbol: "q" },
  { factor: 1e-27, name: "ronto", symbol: "r" },
  { factor: 1e-24, name: "yocto", symbol: "y" },
  { factor: 1e-21, name: "zepto", symbol: "z" },
  { factor: 1e-18, name: "atto", symbol: "a" },
  { factor: 1e-15, name: "femto", symbol: "f" },
  { factor: 1e-12, name: "pico", symbol: "p" },
  { factor: 1e-9, name: "nano", symbol: "n" },
  { factor: 1e-6, name: "micro", symbol: "u" },
  { factor: 1e-3, name: "milli", symbol: "m" },
  { factor: 1e-2, name: "centi", symbol: "c" },
  { factor: 1e-1, name: "deci", symbol: "d" },
  { factor: 1, name: "", symbol: "" },
  { factor: 1e1, name: "deca", symbol: "da" },
  { factor: 1e2, name: "hecto", symbol: "h" },
  { factor: 1e3, name: "kilo", symbol: "k" },
  { factor: 1e6, name: "mega", symbol: "M" },
  { factor: 1e9, name: "giga", symbol: "G" },
  { factor: 1e12, name: "tera", symbol: "T" },
  { factor: 1e15, name: "peta", symbol: "P" },
  { factor: 1e18, name: "exa", symbol: "E" },
  { factor: 1e21, name: "zetta", symbol: "Z" },
  { factor: 1e24, name: "yotta", symbol: "Y" },
  { factor: 1e27, name: "ronna", symbol: "R" },
  { factor: 1e30, name: "quetta", symbol: "Q" },
];

const literFactors = Object.fromEntries(
  prefixes.map(({ factor, name, symbol }) => [
    `${symbol}l`,
    {
      name: name ? `${name[0]?.toUpperCase()}${name.slice(1)}liter` : "Liter",
      factor,
      cite: siCitation,
    },
  ]),
);

const cubicMeterFactors = Object.fromEntries(
  prefixes.map(({ factor, name, symbol }) => [
    `${symbol}m3`,
    {
      name: `Cubic ${name}meter`,
      factor: factor ** 3 * 1000,
      cite: siCitation,
    },
  ]),
);

export const measureFactors = {
  // Complete SI prefix ranges for liters and cubic meters.
  ...literFactors,
  ...cubicMeterFactors,
  cc: {
    name: "Cubic centimeter (cc)",
    factor: 0.001,
    cite: siCitation,
  },

  // US liquid volume
  "us-minim": {
    name: "Minim (US)",
    factor: usLiquidGallon / 61_440,
    cite: nistCitation,
  },
  "us-fluid-dram": {
    name: "Fluid dram (US)",
    factor: usLiquidGallon / 1024,
    cite: nistCitation,
  },
  "us-teaspoon": {
    name: "Teaspoon (US customary)",
    factor: usLiquidGallon / 768,
    cite: nistCitation,
  },
  "us-tablespoon": {
    name: "Tablespoon (US customary)",
    factor: usLiquidGallon / 256,
    cite: nistCitation,
  },
  "us-fluid-ounce": {
    name: "Fluid ounce (US)",
    factor: usLiquidGallon / 128,
    cite: nistCitation,
  },
  "us-jigger": {
    name: "Jigger or shot (US, 1.5 fluid ounces)",
    factor: (usLiquidGallon / 128) * 1.5,
    cite: nistCitation,
  },
  "us-gill": {
    name: "Gill (US)",
    factor: usLiquidGallon / 32,
    cite: nistCitation,
  },
  "us-cup": {
    name: "Cup (US customary)",
    factor: usLiquidGallon / 16,
    cite: nistCitation,
  },
  pt: {
    name: "Pint (US liquid)",
    factor: usLiquidGallon / 8,
    cite: nistCitation,
  },
  "us-liquid-quart": {
    name: "Quart (US liquid)",
    factor: usLiquidGallon / 4,
    cite: nistCitation,
  },
  "us-liquid-gallon": {
    name: "Gallon (US liquid)",
    factor: usLiquidGallon,
    cite: nistCitation,
  },
  "us-liquid-barrel": {
    name: "Barrel (US liquid, 31.5 gallons)",
    factor: usLiquidGallon * 31.5,
    cite: nistCitation,
  },
  "us-oil-barrel": {
    name: "Oil barrel (US, 42 gallons)",
    factor: usLiquidGallon * 42,
    cite: nistCitation,
  },
  "us-hogshead": {
    name: "Hogshead (US, 63 gallons)",
    factor: usLiquidGallon * 63,
    cite: nistCitation,
  },

  // US dry volume
  "us-dry-pint": {
    name: "Pint (US dry)",
    factor: usDryPint,
    cite: nistCitation,
  },
  "us-dry-quart": {
    name: "Quart (US dry)",
    factor: usDryPint * 2,
    cite: nistCitation,
  },
  "us-dry-gallon": {
    name: "Gallon (US dry)",
    factor: usDryPint * 8,
    cite: nistCitation,
  },
  "us-peck": {
    name: "Peck (US dry)",
    factor: usDryPint * 16,
    cite: nistCitation,
  },
  "us-bushel": {
    name: "Bushel (US)",
    factor: usDryPint * 64,
    cite: nistCitation,
  },
  "us-dry-barrel": {
    name: "Barrel (US dry, 7,056 cubic inches)",
    factor: 7056 * 0.016387064,
    cite: nistCitation,
  },

  // British Imperial volume
  "imp-minim": {
    name: "Minim (Imperial)",
    factor: imperialGallon / 76_800,
    cite: imperialCitation,
  },
  "imp-fluid-drachm": {
    name: "Fluid drachm (Imperial)",
    factor: imperialGallon / 1280,
    cite: imperialCitation,
  },
  "imp-fluid-ounce": {
    name: "Fluid ounce (Imperial)",
    factor: imperialGallon / 160,
    cite: imperialCitation,
  },
  "imp-gill": {
    name: "Gill (Imperial)",
    factor: imperialGallon / 32,
    cite: imperialCitation,
  },
  "imp-cup": {
    name: "Cup (Imperial, 10 fluid ounces)",
    factor: imperialGallon / 16,
    cite: imperialCitation,
  },
  imppt: {
    name: "Pint (Imperial)",
    factor: imperialGallon / 8,
    cite: imperialCitation,
  },
  "imp-quart": {
    name: "Quart (Imperial)",
    factor: imperialGallon / 4,
    cite: imperialCitation,
  },
  impgal: {
    name: "Gallon (Imperial)",
    factor: imperialGallon,
    cite: imperialCitation,
  },

  // Cooking measures with explicitly named standards
  "metric-quarter-teaspoon": {
    name: "Quarter teaspoon (metric)",
    factor: 0.00125,
    cite: nistVolumeCitation,
  },
  "metric-half-teaspoon": {
    name: "Half teaspoon (metric)",
    factor: 0.0025,
    cite: nistVolumeCitation,
  },
  "metric-teaspoon": {
    name: "Teaspoon (metric)",
    factor: 0.005,
    cite: nistVolumeCitation,
  },
  "metric-dessert-spoon": {
    name: "Dessert spoon (metric)",
    factor: 0.01,
    cite: nistVolumeCitation,
  },
  "metric-tablespoon": {
    name: "Tablespoon (metric)",
    factor: 0.015,
    cite: nistVolumeCitation,
  },
  "australian-tablespoon": {
    name: "Tablespoon (Australian)",
    factor: 0.02,
    cite: "https://www.health.gov.au/resources/publications/australian-dietary-guidelines",
  },
  "us-legal-cup": {
    name: "Cup (US legal or nutrition labeling)",
    factor: 0.24,
    cite: nistVolumeCitation,
  },
  "metric-cup": {
    name: "Cup (metric)",
    factor: 0.25,
    cite: nistVolumeCitation,
  },

  // Cubic, construction, land, and shipping volume
  cuin: {
    name: "Cubic inch",
    factor: 0.0254 ** 3 * 1000,
    cite: nistCitation,
  },
  cuft: {
    name: "Cubic foot",
    factor: internationalFoot ** 3 * 1000,
    cite: nistCitation,
  },
  cuyd: {
    name: "Cubic yard",
    factor: internationalYard ** 3 * 1000,
    cite: nistCitation,
  },
  cufathom: {
    name: "Cubic fathom",
    factor: (internationalFoot * 6) ** 3 * 1000,
    cite: nistCitation,
  },
  cumi: {
    name: "Cubic mile",
    factor: internationalMile ** 3 * 1000,
    cite: nistCitation,
  },
  boardfoot: {
    name: "Board foot",
    factor: internationalFoot ** 2 * 0.0254 * 1000,
    cite: nistCitation,
  },
  cord: {
    name: "Cord (wood)",
    factor: 128 * internationalFoot ** 3 * 1000,
    cite: nistCitation,
  },
  "register-ton": {
    name: "Register ton",
    factor: 100 * internationalFoot ** 3 * 1000,
    cite: nistCitation,
  },
  "freight-ton": {
    name: "Freight ton (40 cubic feet)",
    factor: 40 * internationalFoot ** 3 * 1000,
    cite: nistCitation,
  },
  "acre-inch": {
    name: "Acre-inch",
    factor: 43_560 * internationalFoot ** 2 * 0.0254 * 1000,
    cite: nistCitation,
  },
  "acre-foot": {
    name: "Acre-foot",
    factor: 43_560 * internationalFoot ** 3 * 1000,
    cite: nistCitation,
  },
  "cuft-us-survey": {
    name: "Cubic US survey foot",
    factor: usSurveyFoot ** 3 * 1000,
    cite: nistCitation,
  },
  "acre-foot-us-survey": {
    name: "Acre-foot (US survey)",
    factor: 43_560 * usSurveyFoot ** 3 * 1000,
    cite: nistCitation,
  },

  // Beer and cask measures; region and cask size are explicit.
  "us-beer-barrel": {
    name: "Beer barrel (US, 31 gallons)",
    factor: usLiquidGallon * 31,
    cite: nistCitation,
  },
  "us-half-barrel-keg": {
    name: "Half-barrel keg (US)",
    factor: usLiquidGallon * 15.5,
    cite: nistCitation,
  },
  "us-quarter-barrel-keg": {
    name: "Quarter-barrel keg (US)",
    factor: usLiquidGallon * 7.75,
    cite: nistCitation,
  },
  "us-sixth-barrel-keg": {
    name: "Sixth-barrel keg (US)",
    factor: (usLiquidGallon * 31) / 6,
    cite: nistCitation,
  },
  "imp-pin": {
    name: "Pin (Imperial beer cask)",
    factor: imperialGallon * 4.5,
    cite: imperialCitation,
  },
  "imp-firkin": {
    name: "Firkin (Imperial beer cask)",
    factor: imperialGallon * 9,
    cite: imperialCitation,
  },
  "imp-kilderkin": {
    name: "Kilderkin (Imperial beer cask)",
    factor: imperialGallon * 18,
    cite: imperialCitation,
  },
  "imp-beer-barrel": {
    name: "Barrel (Imperial beer, 36 gallons)",
    factor: imperialGallon * 36,
    cite: imperialCitation,
  },
  "imp-beer-hogshead": {
    name: "Hogshead (Imperial beer, 54 gallons)",
    factor: imperialGallon * 54,
    cite: imperialCitation,
  },
  "imp-beer-butt": {
    name: "Butt (Imperial beer, 108 gallons)",
    factor: imperialGallon * 108,
    cite: imperialCitation,
  },
  "imp-beer-tun": {
    name: "Tun (Imperial beer, 216 gallons)",
    factor: imperialGallon * 216,
    cite: imperialCitation,
  },

  // East Asian volume standards
  "japanese-shaku-volume": {
    name: "Shaku (Japanese volume)",
    factor: japaneseSho / 100,
    cite: japaneseCitation,
  },
  "japanese-go": {
    name: "Gō (Japanese volume)",
    factor: japaneseSho / 10,
    cite: japaneseCitation,
  },
  "japanese-sho": {
    name: "Shō (Japanese volume)",
    factor: japaneseSho,
    cite: japaneseCitation,
  },
  "japanese-to": {
    name: "To (Japanese volume)",
    factor: japaneseSho * 10,
    cite: japaneseCitation,
  },
  "japanese-koku": {
    name: "Koku (Japanese volume)",
    factor: japaneseSho * 100,
    cite: japaneseCitation,
  },
  "chinese-ge": {
    name: "Ge (modern Chinese volume)",
    factor: 0.1,
    cite: "https://en.wikipedia.org/wiki/Ge_(unit)",
  },
  "chinese-sheng": {
    name: "Sheng (modern Chinese volume)",
    factor: 1,
    cite: "https://en.wikipedia.org/wiki/Sheng_(volume)",
  },
  "chinese-dou": {
    name: "Dou (modern Chinese volume)",
    factor: 10,
    cite: "https://en.wikipedia.org/wiki/Sheng_(volume)",
  },
  "chinese-dan": {
    name: "Dan or shi (modern Chinese volume)",
    factor: 100,
    cite: "https://en.wikipedia.org/wiki/Sheng_(volume)",
  },
  "korean-doe": {
    name: "Doe (traditional Korean volume)",
    factor: japaneseSho,
    cite: "https://en.wikipedia.org/wiki/Sheng_(volume)",
  },

  // Astronomical cubic units
  cuau: {
    name: "Cubic astronomical unit",
    factor: astronomicalUnit ** 3 * 1000,
    cite: siCitation,
  },
  culy: {
    name: "Cubic light-year",
    factor: lightYear ** 3 * 1000,
    cite: siCitation,
  },
  cupc: {
    name: "Cubic parsec",
    factor: parsec ** 3 * 1000,
    cite: siCitation,
  },
} satisfies Record<string, { cite: string; factor: number; name: string }>;
