import { createSiFactors } from "../si-prefixes.js";

const siFactors = createSiFactors("H", "henry");

// NIST SP 811 Appendix B.9 gives 1 abhenry = 10^-9 H and
// 1 stathenry = 8.987552 × 10^11 H (the latter is rounded).
const nistSource =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9";

export const measureFactors = {
  ...siFactors,
  µH: { ...siFactors.uH!, name: "Microhenry (µH)" },
  μH: { ...siFactors.uH!, name: "Microhenry (Greek mu alias)" },
  "Wb/A": { cite: nistSource, factor: 1, name: "Weber per ampere" },
  "V*s/A": { cite: nistSource, factor: 1, name: "Volt-second per ampere" },
  "ohm*s": { cite: nistSource, factor: 1, name: "Ohm-second" },
  abhenry: { cite: nistSource, factor: 1e-9, name: "Abhenry (CGS-EMU)" },
  stathenry: {
    cite: nistSource,
    factor: 8.987552e11,
    name: "Stathenry (CGS-ESU, approximate)",
  },
};
