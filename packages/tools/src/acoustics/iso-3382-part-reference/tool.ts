import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description: "Map the principal scopes of ISO 3382 Parts 1, 2, and 3.",
  entries: {
    "part-1": {
      source: "ISO 3382-1",
      statement:
        "ISO 3382-1 specifies measurement of room-acoustic parameters in performance spaces.",
    },
    "part-2": {
      source: "ISO 3382-2",
      statement:
        "ISO 3382-2 specifies measurement of reverberation time in ordinary rooms.",
    },
    "part-3": {
      source: "ISO 3382-3",
      statement:
        "ISO 3382-3 specifies measurement of room-acoustic parameters in open-plan offices.",
    },
  },
  exampleTopic: "part-1",
  id: "acoustics/iso-3382-part-reference",
  title: "ISO 3382 Part Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
