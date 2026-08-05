import { createSiFactors } from "../si-prefixes.js";

const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one volt.
export const measureFactors = {
  ...createSiFactors("V", "volt"),
  abV: { name: "Abvolt (emu)", factor: 1e-8, cite: NIST },
  statV: {
    name: "Statvolt (esu)",
    factor: 299.792458,
    cite: NIST,
  },
};
