import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the audiovisual speech-conflict phenomenon and experimental cautions.",
  entries: {
    phenomenon: {
      source: "McGurk and MacDonald, Nature, 1976",
      statement:
        "Conflicting seen and heard syllables can produce a fused or altered phonetic percept, demonstrating audiovisual speech integration.",
    },
    variability: {
      source: "Audiovisual speech research",
      statement:
        "Response strength varies with stimulus quality, language, attention, age, and individual listener.",
    },
    caution: {
      source: "Audiovisual speech research",
      statement:
        "A single demonstration response is not a hearing, vision, or neurological diagnosis.",
    },
  },
  exampleTopic: "phenomenon",
  id: "acoustics/mcgurk-effect-reference",
  title: "McGurk Effect Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
