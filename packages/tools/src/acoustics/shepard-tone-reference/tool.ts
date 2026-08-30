import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the construction and perceptual limitation of the Shepard-tone pitch-class illusion.",
  entries: {
    construction: {
      source: "Roger Shepard, 1964",
      statement:
        "A Shepard tone combines octave-spaced components under a fixed spectral envelope so pitch class is emphasized while absolute register is ambiguous.",
    },
    "endless-scale": {
      source: "Roger Shepard, 1964; Risset continuous variants",
      statement:
        "Sequencing Shepard tones by pitch class while shifting component amplitudes can create an apparent continuously rising or falling scale.",
    },
    caution: {
      source: "Auditory-illusion literature",
      statement:
        "The illusion depends on synthesis and listening conditions and does not create physically unbounded frequency.",
    },
  },
  exampleTopic: "construction",
  id: "acoustics/shepard-tone-reference",
  title: "Shepard Tone Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
