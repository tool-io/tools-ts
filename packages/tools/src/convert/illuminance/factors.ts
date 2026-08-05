import { createSiFactors } from "../si-prefixes.js";

const NIST_LIGHT =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9";

export const measureFactors = {
  ...createSiFactors("lx", "lux"),
  fc: {
    name: "Foot-candle",
    factor: 10.763910416709722,
    cite: NIST_LIGHT,
  },
  ph: { name: "Phot", factor: 10_000, cite: NIST_LIGHT },
  nox: {
    name: "Nox",
    factor: 0.001,
    cite: "https://en.wikipedia.org/wiki/Nox_(unit)",
  },
  "meter-candle": {
    name: "Meter-candle",
    factor: 1,
    cite: NIST_LIGHT,
  },
};
