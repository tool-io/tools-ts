import { createSiFactors } from "../si-prefixes.js";

const NIST =
  "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";
const day = 86_400;

export const measureFactors = {
  ...createSiFactors("s", "second"),
  min: { name: "Minute", factor: 60, cite: NIST },
  h: { name: "Hour", factor: 3600, cite: NIST },
  day: { name: "Day", factor: day, cite: NIST },
  week: { name: "Week", factor: 7 * day, cite: NIST },
  fortnight: {
    name: "Fortnight",
    factor: 14 * day,
    cite: NIST,
  },
  "year-common": {
    name: "Year (365 days)",
    factor: 365 * day,
    cite: NIST,
  },
  "year-julian": {
    name: "Year (Julian, 365.25 days)",
    factor: 365.25 * day,
    cite: NIST,
  },
  "year-gregorian-mean": {
    name: "Year (Gregorian mean, 365.2425 days)",
    factor: 365.2425 * day,
    cite: "https://aa.usno.navy.mil/faq/calendars",
  },
  "month-gregorian-mean": {
    name: "Month (Gregorian mean)",
    factor: (365.2425 / 12) * day,
    cite: "https://aa.usno.navy.mil/faq/calendars",
  },
  decade: {
    name: "Decade (10 Gregorian mean years)",
    factor: 10 * 365.2425 * day,
    cite: NIST,
  },
  century: {
    name: "Century (100 Gregorian mean years)",
    factor: 100 * 365.2425 * day,
    cite: NIST,
  },
  millennium: {
    name: "Millennium (1,000 Gregorian mean years)",
    factor: 1000 * 365.2425 * day,
    cite: NIST,
  },
};
