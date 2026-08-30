import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the modulation-rate context and limitations of psychoacoustic fluctuation strength.",
  entries: {
    "peak-rate": {
      source: "Zwicker and Fastl psychoacoustics literature",
      statement:
        "Fluctuation strength is generally strongest for slow amplitude modulation near 4 Hz under reference-like conditions.",
    },
    unit: {
      source: "Zwicker and Fastl psychoacoustics literature",
      statement:
        "Fluctuation strength is reported in vacil; one vacil is defined by a specified reference modulation sensation.",
    },
    caution: {
      source: "Psychoacoustic fluctuation-strength methods",
      statement:
        "Carrier spectrum, level, modulation depth, duration, and method affect the result, so 4 Hz is not a universal measured maximum.",
    },
  },
  exampleTopic: "peak-rate",
  id: "acoustics/fluctuation-strength-reference",
  title: "Fluctuation Strength Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
