import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the historical scope of Knudsen-era ocean ambient-noise spectra.",
  entries: {
    scope: {
      source: "Vern Knudsen and colleagues, 1948",
      statement:
        "Knudsen curves summarized empirical underwater ambient-noise spectra associated with sea state in an early frequency-range model.",
    },
    variables: {
      source: "Ocean ambient-noise literature",
      statement:
        "Wind and sea state influence portions of the spectrum, while shipping, biology, rain, ice, and local conditions can dominate elsewhere.",
    },
    caution: {
      source: "Ocean ambient-noise literature",
      statement:
        "Historical curves are not a substitute for a site-specific modern measurement or a calibrated prediction dataset.",
    },
  },
  exampleTopic: "scope",
  id: "acoustics/knudsen-curve-reference",
  title: "Knudsen Curve Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
