import { createSiFactors } from "../si-prefixes.js";

const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one kilogram. SI prefixes attach to gram, so kg naturally has factor 1.
export const measureFactors = {
  ...createSiFactors("g", "gram", 1e-3),
  t: { name: "Metric tonne", factor: 1000, cite: NIST },
  Da: {
    name: "Dalton (unified atomic mass unit)",
    factor: 1.6605390666e-27,
    cite: "https://physics.nist.gov/cgi-bin/cuu/Value?ukg",
  },
  ct: { name: "Carat", factor: 0.0002, cite: NIST },
  gr: { name: "Grain", factor: 0.00006479891, cite: NIST },
  dram: {
    name: "Dram (avoirdupois)",
    factor: 0.0017718451953125,
    cite: NIST,
  },
  oz: {
    name: "Ounce (avoirdupois)",
    factor: 0.028349523125,
    cite: NIST,
  },
  ozt: {
    name: "Ounce (troy)",
    factor: 0.0311034768,
    cite: NIST,
  },
  lb: {
    name: "Pound (avoirdupois)",
    factor: 0.45359237,
    cite: NIST,
  },
  stone: { name: "Stone", factor: 6.35029318, cite: NIST },
  "short-cwt": {
    name: "Hundredweight (US)",
    factor: 45.359237,
    cite: NIST,
  },
  "long-cwt": {
    name: "Hundredweight (imperial)",
    factor: 50.80234544,
    cite: NIST,
  },
  "short-ton": {
    name: "Ton (US short)",
    factor: 907.18474,
    cite: NIST,
  },
  "long-ton": {
    name: "Ton (imperial long)",
    factor: 1016.0469088,
    cite: NIST,
  },
  "solar-mass": {
    name: "Nominal solar mass",
    factor: 1.98847e30,
    cite: "https://www.iau.org/publications/proceedings_rules/units/",
  },
};
