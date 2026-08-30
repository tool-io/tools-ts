import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the two-channel pattern and localization cautions of Deutsch’s octave illusion.",
  entries: {
    stimulus: {
      source: "Diana Deutsch, 1974",
      statement:
        "Deutsch’s octave illusion alternates high and low tones between the ears so each ear receives the opposite sequence.",
    },
    percept: {
      source: "Diana Deutsch octave-illusion research",
      statement:
        "Many listeners report one pitch stream that alternates between ears, but percepts vary across listeners and configurations.",
    },
    caution: {
      source: "Auditory-illusion literature",
      statement:
        "The illusion is not a general stereo-channel test and requires controlled dichotic presentation.",
    },
  },
  exampleTopic: "stimulus",
  id: "acoustics/octave-illusion-reference",
  title: "Octave Illusion Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
