import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the definition, unit, reference sound, and interpretation cautions for psychoacoustic sharpness.",
  entries: {
    unit: {
      source: "DIN 45692",
      statement:
        "Psychoacoustic sharpness is expressed in acum and weights high-frequency specific loudness more strongly.",
    },
    reference: {
      source: "DIN 45692",
      statement:
        "One acum is tied to the standardized reference sensation described by the selected sharpness method; method and signal conditions must be reported.",
    },
    caution: {
      source: "DIN 45692 and psychoacoustic literature",
      statement:
        "Sharpness is not a simple treble-level ratio and values from different calculation methods may differ.",
    },
  },
  exampleTopic: "unit",
  id: "acoustics/sharpness-reference",
  title: "Acoustic Sharpness Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
