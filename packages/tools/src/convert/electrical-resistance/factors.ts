import { createSiFactors } from "../si-prefixes.js";

const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one ohm.
export const measureFactors = {
  ...createSiFactors("ohm", "ohm"),
  abohm: { name: "Abohm (emu)", factor: 1e-9, cite: NIST },
  statohm: {
    name: "Statohm (esu)",
    factor: 8.987551787368176e11,
    cite: NIST,
  },
};
