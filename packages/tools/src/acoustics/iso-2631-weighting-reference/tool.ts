import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return whole-body-vibration weighting and axis-selection cautions.",
  entries: {
    axis: {
      source: "ISO 2631-1",
      statement:
        "ISO 2631-1 applies frequency weightings according to vibration direction, posture, and assessment purpose rather than one weighting for every axis.",
    },
    "weighted-value": {
      source: "ISO 2631-1",
      statement:
        "Weighted acceleration is combined with duration and, where applicable, crest-factor or dose methods defined by the assessment.",
    },
    caution: {
      source: "ISO 2631 series",
      statement:
        "Weighting labels such as Wk, Wd, or related variants must be taken from the applicable part and edition; they are not interchangeable.",
    },
  },
  exampleTopic: "axis",
  id: "acoustics/iso-2631-weighting-reference",
  title: "ISO 2631 Weighting Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
