import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Compare broad shoebox, vineyard, and fan-shaped hall geometry without ranking a shape independently of detailed design.",
  entries: {
    shoebox: {
      source: "Leo Beranek concert-hall studies and ISO 3382-1 metrics",
      statement:
        "A shoebox hall is a relatively narrow rectangular volume whose side walls can support early lateral reflections; proportions alone do not guarantee quality.",
    },
    vineyard: {
      source: "Published concert-hall design literature",
      statement:
        "A vineyard hall surrounds the platform with terraced audience blocks and uses terrace fronts and overhead elements to distribute reflections.",
    },
    fan: {
      source: "Published concert-hall design literature",
      statement:
        "A fan-shaped plan can increase audience proximity but may provide weaker early lateral reflections unless surfaces are designed to compensate.",
    },
  },
  exampleTopic: "shoebox",
  id: "acoustics/concert-hall-shape-reference",
  title: "Concert Hall Shape Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
