import { createSiFactors } from "../si-prefixes.js";

export const NIST_LIGHT =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9";

export const measureFactors = {
  ...createSiFactors("cd/m2", "candela per square meter"),
  nit: { name: "Nit", factor: 1, cite: NIST_LIGHT },
  asb: {
    name: "Apostilb",
    factor: 1 / Math.PI,
    cite: "https://en.wikipedia.org/wiki/Apostilb",
  },
  sb: { name: "Stilb", factor: 10_000, cite: NIST_LIGHT },
  L: {
    name: "Lambert",
    factor: 10_000 / Math.PI,
    cite: NIST_LIGHT,
  },
  fL: {
    name: "Foot-lambert",
    factor: 3.4262590996353905,
    cite: NIST_LIGHT,
  },
  "cd/cm2": {
    name: "Candela per square centimeter",
    factor: 10_000,
    cite: NIST_LIGHT,
  },
  "cd/in2": {
    name: "Candela per square inch",
    factor: 1550.0031000062,
    cite: NIST_LIGHT,
  },
  "cd/ft2": {
    name: "Candela per square foot",
    factor: 10.763910416709722,
    cite: NIST_LIGHT,
  },
};
