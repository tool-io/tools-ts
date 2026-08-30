import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return placement controls for reducing local surface-reflection bias in environmental measurements.",
  entries: {
    clearance: {
      source: "ISO 1996 series and applicable measurement protocol",
      statement:
        "Microphone height and distance from façades or other reflecting surfaces must follow the stated measurement standard and assessment objective.",
    },
    weather: {
      source: "ISO 1996 series",
      statement:
        "Wind, rain, temperature gradients, and ground condition can affect results and should be documented with the prescribed windscreen.",
    },
    caution: {
      source: "Environmental acoustics measurement practice",
      statement:
        "A tripod height alone cannot eliminate reflections; geometry, incidence, field type, and correction method remain relevant.",
    },
  },
  exampleTopic: "clearance",
  id: "acoustics/microphone-placement-reference",
  title: "Microphone Placement Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
