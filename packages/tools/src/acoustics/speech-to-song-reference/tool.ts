import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the repetition-based speech-to-song illusion and its limitations.",
  entries: {
    phenomenon: {
      source: "Diana Deutsch speech-to-song research",
      statement:
        "Repeated presentation of a spoken phrase can cause it to be heard as sung without changing the recording.",
    },
    features: {
      source: "Speech-to-song research",
      statement:
        "Stable prosody and repetition support the perceptual shift, while phrase choice and listener response affect its strength.",
    },
    caution: {
      source: "Speech-to-song research",
      statement:
        "The illusion does not imply that all repeated speech becomes music or provide a clinical assessment.",
    },
  },
  exampleTopic: "phenomenon",
  id: "acoustics/speech-to-song-reference",
  title: "Speech-to-Song Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
