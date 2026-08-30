import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the WHO Europe night-noise guideline and interim-target context.",
  entries: {
    guideline: {
      source: "WHO Night Noise Guidelines for Europe (2009)",
      statement:
        "The 2009 WHO Night Noise Guidelines for Europe identify an annual outdoor Lnight guideline of 40 dB.",
    },
    "interim-target": {
      source: "WHO Night Noise Guidelines for Europe (2009)",
      statement:
        "WHO identifies 55 dB Lnight,outside as an interim target where 40 dB cannot be achieved in the short term.",
    },
    caution: {
      source: "WHO Night Noise Guidelines for Europe (2009)",
      statement:
        "These annual outdoor indicators are not a single-event indoor limit and must be applied with the document scope and local law.",
    },
  },
  exampleTopic: "guideline",
  id: "acoustics/who-night-noise-reference",
  title: "WHO Night-Noise Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
