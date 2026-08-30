import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the impulse-response convolution and binaural-rendering stages of acoustic auralization.",
  entries: {
    convolution: {
      source: "Room-acoustic auralization literature",
      statement:
        "Auralization commonly convolves an anechoic source signal with a measured or simulated room impulse response.",
    },
    binaural: {
      source: "AES and spatial-audio literature",
      statement:
        "Binaural rendering uses ear-specific responses or HRTFs and requires stated head orientation, receiver model, and playback method.",
    },
    caution: {
      source: "Room-acoustic auralization literature",
      statement:
        "Plausibility depends on source directivity, room model, dynamic range, transducers, calibration, and listener-specific cues.",
    },
  },
  exampleTopic: "convolution",
  id: "acoustics/auralization-process-reference",
  title: "Auralization Process Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
