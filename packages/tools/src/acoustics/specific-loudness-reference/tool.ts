import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the role of critical-band rate in the Zwicker loudness model.",
  entries: {
    definition: {
      source: "ISO 532-1:2017",
      statement:
        "Specific loudness distributes modeled loudness over critical-band rate, commonly expressed in sones per Bark.",
    },
    integration: {
      source: "ISO 532-1:2017",
      statement:
        "Total loudness in the Zwicker method is obtained by integrating specific loudness over critical-band rate.",
    },
    caution: {
      source: "ISO 532-1:2017",
      statement:
        "A critical-band pattern requires a defined spectrum, field condition, and method; it cannot be inferred from one broadband dB value.",
    },
  },
  exampleTopic: "definition",
  id: "acoustics/specific-loudness-reference",
  title: "Specific Loudness Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
