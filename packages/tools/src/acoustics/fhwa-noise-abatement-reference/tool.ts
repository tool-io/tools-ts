import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the federal highway-noise criterion context for common receptor categories.",
  entries: {
    "category-b": {
      source: "23 CFR Part 772, Table 1",
      statement:
        "The federal Activity Category B exterior criterion for residential uses is 67 dBA Leq(h); impact policy also considers substantial increase under the state procedure.",
    },
    "category-c": {
      source: "23 CFR Part 772, Table 1",
      statement:
        "Activity Category C includes exterior areas such as schools, parks, and places of worship and also uses 67 dBA Leq(h) in the federal table.",
    },
    caution: {
      source: "FHWA Highway Traffic Noise guidance",
      statement:
        "The Noise Abatement Criteria are impact-evaluation triggers, not design goals or absolute federal property-line limits.",
    },
  },
  exampleTopic: "category-b",
  id: "acoustics/fhwa-noise-abatement-reference",
  title: "FHWA Noise Abatement Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
