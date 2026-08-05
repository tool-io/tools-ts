const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one radian.
export const measureFactors = {
  rad: { name: "Radian", factor: 1, cite: NIST },
  mrad: { name: "Milliradian", factor: 0.001, cite: NIST },
  deg: { name: "Degree", factor: Math.PI / 180, cite: NIST },
  grad: {
    name: "Gradian (gon)",
    factor: Math.PI / 200,
    cite: NIST,
  },
  rev: { name: "Revolution", factor: 2 * Math.PI, cite: NIST },
  quadrant: {
    name: "Quadrant",
    factor: Math.PI / 2,
    cite: NIST,
  },
  arcmin: {
    name: "Arcminute",
    factor: Math.PI / 10_800,
    cite: NIST,
  },
  arcsec: {
    name: "Arcsecond",
    factor: Math.PI / 648_000,
    cite: NIST,
  },
  "mil-nato": {
    name: "NATO angular mil",
    factor: (2 * Math.PI) / 6400,
    cite: "https://en.wikipedia.org/wiki/Milliradian",
  },
};
