import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return dated IEC 60268-16 edition context without treating editions as numerically interchangeable.",
  entries: {
    current: {
      source: "IEC 60268-16:2020",
      statement:
        "IEC 60268-16:2020 is the fifth edition of the objective speech-intelligibility standard.",
    },
    earlier: {
      source: "IEC 60268-16 edition history",
      statement:
        "Earlier editions introduced and revised STI-related methods, test signals, weighting, and application cautions.",
    },
    caution: {
      source: "IEC 60268-16",
      statement:
        "A result should identify the edition and method used; reprocessing may be needed before comparing results across procedures.",
    },
  },
  exampleTopic: "current",
  id: "acoustics/sti-edition-history",
  title: "STI Edition History",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
