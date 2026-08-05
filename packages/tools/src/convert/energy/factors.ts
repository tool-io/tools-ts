const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";

// Base: one joule.
export const measureFactors = {
  J: { name: "Joule", factor: 1, cite: NIST },
  kJ: { name: "Kilojoule", factor: 1000, cite: NIST },
  MJ: { name: "Megajoule", factor: 1e6, cite: NIST },
  GJ: { name: "Gigajoule", factor: 1e9, cite: NIST },
  Wh: { name: "Watt-hour", factor: 3600, cite: NIST },
  kWh: { name: "Kilowatt-hour", factor: 3.6e6, cite: NIST },
  MWh: { name: "Megawatt-hour", factor: 3.6e9, cite: NIST },
  GWh: { name: "Gigawatt-hour", factor: 3.6e12, cite: NIST },
  cal: {
    name: "Calorie (thermochemical)",
    factor: 4.184,
    cite: NIST,
  },
  kcal: {
    name: "Kilocalorie (dietary Calorie)",
    factor: 4184,
    cite: NIST,
  },
  "cal-IT": {
    name: "Calorie (International Table)",
    factor: 4.1868,
    cite: NIST,
  },
  "Btu-IT": {
    name: "British thermal unit (International Table)",
    factor: 1055.05585262,
    cite: NIST,
  },
  "Btu-th": {
    name: "British thermal unit (thermochemical)",
    factor: 1054.35026444,
    cite: NIST,
  },
  eV: {
    name: "Electronvolt",
    factor: 1.602176634e-19,
    cite: "https://physics.nist.gov/cgi-bin/cuu/Value?evj",
  },
  keV: {
    name: "Kiloelectronvolt",
    factor: 1.602176634e-16,
    cite: "https://physics.nist.gov/cgi-bin/cuu/Value?evj",
  },
  MeV: {
    name: "Megaelectronvolt",
    factor: 1.602176634e-13,
    cite: "https://physics.nist.gov/cgi-bin/cuu/Value?evj",
  },
  GeV: {
    name: "Gigaelectronvolt",
    factor: 1.602176634e-10,
    cite: "https://physics.nist.gov/cgi-bin/cuu/Value?evj",
  },
  erg: { name: "Erg", factor: 1e-7, cite: NIST },
  "ft-lbf": {
    name: "Foot-pound force",
    factor: 1.3558179483314,
    cite: NIST,
  },
  "therm-US": {
    name: "Therm (US)",
    factor: 105_480_400,
    cite: NIST,
  },
  "ton-TNT": {
    name: "Ton of TNT",
    factor: 4.184e9,
    cite: NIST,
  },
  toe: {
    name: "Tonne of oil equivalent",
    factor: 41.868e9,
    cite: NIST,
  },
};
