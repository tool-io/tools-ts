import { createSiFactors } from "../si-prefixes.js";

const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one siemens.
export const measureFactors = {
  ...createSiFactors("S", "siemens"),
  mho: { name: "Mho", factor: 1, cite: NIST },
  abmho: { name: "Abmho (absiemens)", factor: 1e9, cite: NIST },
  statmho: {
    name: "Statmho (statsiemens)",
    factor: 1.11265005605362e-12,
    cite: NIST,
  },
};
