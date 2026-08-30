import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return documented contributions of Vern Oliver Knudsen without assigning a disputed “first acoustician” title.",
  entries: {
    career: {
      source: "UCLA and Acoustical Society of America historical records",
      statement:
        "Vern Oliver Knudsen was a UCLA physicist and acoustician known for architectural and underwater acoustics.",
    },
    asa: {
      source: "Acoustical Society of America history",
      statement:
        "Knudsen was a founder and later president of the Acoustical Society of America.",
    },
    caution: {
      source: "History of acoustics literature",
      statement:
        "“First American acoustician” is not a precise official rank; earlier American researchers also made foundational contributions.",
    },
  },
  exampleTopic: "career",
  id: "acoustics/vern-knudsen-history",
  title: "Vern Knudsen History",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
