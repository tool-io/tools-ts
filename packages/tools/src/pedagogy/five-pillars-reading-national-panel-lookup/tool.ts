import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly readingPillar: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "readingPillar", label: "Reading pillar", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.readingPillar,
      {
        "phonemic-awareness":
          "awareness and manipulation of phonemes in spoken language",
        phonics: "relationships between written symbols and speech sounds",
        fluency: "accurate and appropriately expressive connected-text reading",
        vocabulary: "word meanings and knowledge",
        comprehension: "constructing meaning from text",
      },
      "readingPillar",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { readingPillar: "phonics" } satisfies Input;
export const exampleOutput = {
  meaning: "relationships between written symbols and speech sounds",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/five-pillars-reading-national-panel-lookup",
  title: "Five Pillars Reading National Panel Lookup",
  description:
    "Named US National Reading Panel five reading components, not complete curriculum, equal weights or individual reading diagnosis. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ readingPillar: value.readingPillar as string }),
});
export const run = tool.execute;
export default tool;
