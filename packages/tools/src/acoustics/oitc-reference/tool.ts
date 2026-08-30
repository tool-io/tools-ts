import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the scope and traffic-noise relevance of Outdoor-Indoor Transmission Class.",
  entries: {
    scope: {
      source: "ASTM E1332",
      statement:
        "OITC is a single-number rating derived from outdoor-indoor transmission-loss data over a spectrum intended to represent transportation noise.",
    },
    comparison: {
      source: "ASTM E1332 and ASTM E413",
      statement:
        "OITC and STC use different spectra and classification procedures and must not be interchanged by a fixed offset.",
    },
    caution: {
      source: "ASTM E1332",
      statement:
        "A product rating does not alone predict indoor level; façade area, leakage, ventilation, geometry, and outdoor spectrum also matter.",
    },
  },
  exampleTopic: "scope",
  id: "acoustics/oitc-reference",
  title: "OITC Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
