import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the scope and cautions of Leo Beranek’s concert-hall studies and ratings.",
  entries: {
    books: {
      source:
        "Beranek, Music, Acoustics & Architecture and Concert Halls and Opera Houses",
      statement:
        "Leo Beranek published comparative studies of concert halls combining measured acoustics, design history, and listener or expert judgments.",
    },
    metrics: {
      source: "Beranek concert-hall literature",
      statement:
        "His work helped relate subjective attributes to measures such as reverberation, early decay, clarity, strength, and binaural quality.",
    },
    caution: {
      source: "Beranek concert-hall literature",
      statement:
        "A historical preference ranking is not a universal contemporary score and cannot be reduced to one room metric.",
    },
  },
  exampleTopic: "books",
  id: "acoustics/beranek-concert-hall-reference",
  title: "Beranek Concert Hall Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
