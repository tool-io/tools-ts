import { createSiFactors } from "../si-prefixes.js";

const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one coulomb.
export const measureFactors = {
  ...createSiFactors("C", "coulomb"),
  Ah: { name: "Ampere-hour", factor: 3600, cite: NIST },
  mAh: { name: "Milliampere-hour", factor: 3.6, cite: NIST },
  uAh: { name: "Microampere-hour", factor: 0.0036, cite: NIST },
  e: {
    name: "Elementary charge",
    factor: 1.602176634e-19,
    cite: "https://physics.nist.gov/cgi-bin/cuu/Value?e",
  },
  statC: {
    name: "Statcoulomb (esu)",
    factor: 3.33564095198152e-10,
    cite: NIST,
  },
  abC: { name: "Abcoulomb (emu)", factor: 10, cite: NIST },
};
