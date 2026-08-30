import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return free-field and random-incidence microphone response context.",
  entries: {
    "free-field": {
      source: "IEC 61094 and measurement-microphone manufacturer guidance",
      statement:
        "A free-field microphone is designed so its presence and diffraction are compensated for sound arriving from the specified frontal direction.",
    },
    "random-incidence": {
      source: "IEC 61094 and measurement-microphone manufacturer guidance",
      statement:
        "A random-incidence microphone is equalized for sound arriving from many directions, as in a diffuse field.",
    },
    caution: {
      source: "Microphone calibration documentation",
      statement:
        "Incidence correction depends on microphone model, angle, frequency, and field; use the manufacturer calibration data rather than a universal offset.",
    },
  },
  exampleTopic: "free-field",
  id: "acoustics/microphone-incidence-reference",
  title: "Microphone Incidence Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
