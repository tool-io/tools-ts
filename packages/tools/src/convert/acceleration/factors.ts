const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one meter per second squared.
export const measureFactors = {
  "m/s2": {
    name: "Meter per second squared",
    factor: 1,
    cite: NIST,
  },
  "cm/s2": {
    name: "Centimeter per second squared",
    factor: 0.01,
    cite: NIST,
  },
  "ft/s2": {
    name: "Foot per second squared",
    factor: 0.3048,
    cite: NIST,
  },
  "in/s2": {
    name: "Inch per second squared",
    factor: 0.0254,
    cite: NIST,
  },
  "km/h/s": {
    name: "Kilometer per hour per second",
    factor: 1 / 3.6,
    cite: NIST,
  },
  "mph/s": {
    name: "Mile per hour per second",
    factor: 0.44704,
    cite: NIST,
  },
  "kn/s": {
    name: "Knot per second",
    factor: 1852 / 3600,
    cite: NIST,
  },
  Gal: {
    name: "Galileo (Gal)",
    factor: 0.01,
    cite: NIST,
  },
  g0: {
    name: "Standard gravity",
    factor: 9.80665,
    cite: NIST,
  },
};
