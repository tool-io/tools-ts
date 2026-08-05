const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one radian per second.
export const measureFactors = {
  "rad/s": { name: "Radian per second", factor: 1, cite: NIST },
  "mrad/s": {
    name: "Milliradian per second",
    factor: 0.001,
    cite: NIST,
  },
  "deg/s": {
    name: "Degree per second",
    factor: Math.PI / 180,
    cite: NIST,
  },
  "deg/min": {
    name: "Degree per minute",
    factor: Math.PI / 10_800,
    cite: NIST,
  },
  "deg/h": {
    name: "Degree per hour",
    factor: Math.PI / 648_000,
    cite: NIST,
  },
  "rev/s": {
    name: "Revolution per second",
    factor: 2 * Math.PI,
    cite: NIST,
  },
  rpm: {
    name: "Revolution per minute (RPM)",
    factor: (2 * Math.PI) / 60,
    cite: NIST,
  },
  rph: {
    name: "Revolution per hour",
    factor: (2 * Math.PI) / 3600,
    cite: NIST,
  },
};
