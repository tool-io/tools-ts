import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Distinguish head-shadow level effects from binaural masking-level differences.",
  entries: {
    "head-shadow": {
      source: "Binaural hearing literature",
      statement:
        "The head alters ear-specific spectra and can improve the signal-to-noise ratio at the ear farther from a masker, especially at higher frequencies.",
    },
    "binaural-unmasking": {
      source: "Binaural hearing literature",
      statement:
        "Binaural masking-level differences arise from interaural phase and level cues and are not the same mechanism as acoustic head shadow.",
    },
    caution: {
      source: "Binaural hearing literature",
      statement:
        "There is no universal decibel benefit; frequency, geometry, signal, masker, and listener determine the measured advantage.",
    },
  },
  exampleTopic: "head-shadow",
  id: "acoustics/binaural-unmasking-reference",
  title: "Binaural Unmasking Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
