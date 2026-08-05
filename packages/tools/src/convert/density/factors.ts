const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one kilogram per cubic meter.
export const measureFactors = {
  "kg/m3": {
    name: "Kilogram per cubic meter",
    factor: 1,
    cite: NIST,
  },
  "g/m3": {
    name: "Gram per cubic meter",
    factor: 0.001,
    cite: NIST,
  },
  "g/L": { name: "Gram per liter", factor: 1, cite: NIST },
  "kg/L": {
    name: "Kilogram per liter",
    factor: 1000,
    cite: NIST,
  },
  "g/mL": {
    name: "Gram per milliliter",
    factor: 1000,
    cite: NIST,
  },
  "g/cm3": {
    name: "Gram per cubic centimeter",
    factor: 1000,
    cite: NIST,
  },
  "kg/cm3": {
    name: "Kilogram per cubic centimeter",
    factor: 1_000_000,
    cite: NIST,
  },
  "lb/ft3": {
    name: "Pound per cubic foot",
    factor: 16.01846337396014,
    cite: NIST,
  },
  "lb/in3": {
    name: "Pound per cubic inch",
    factor: 27_679.904710191,
    cite: NIST,
  },
  "oz/in3": {
    name: "Ounce per cubic inch",
    factor: 1729.9940443869,
    cite: NIST,
  },
  "lb/USgal": {
    name: "Pound per US gallon",
    factor: 119.8264273169,
    cite: NIST,
  },
  "oz/USgal": {
    name: "Ounce per US gallon",
    factor: 7.4891517073,
    cite: NIST,
  },
  "lb/Impgal": {
    name: "Pound per imperial gallon",
    factor: 99.7763726631,
    cite: NIST,
  },
};
