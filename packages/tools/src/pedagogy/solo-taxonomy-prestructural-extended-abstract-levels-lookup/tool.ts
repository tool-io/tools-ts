import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly soloLevel: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "soloLevel", label: "Solo level", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.soloLevel,
      {
        prestructural: "response misses the relevant point",
        unistructural: "response addresses one relevant aspect",
        multistructural:
          "response addresses multiple aspects without integrating them",
        relational:
          "response integrates relevant aspects into a coherent whole",
        "extended-abstract":
          "response generalizes or theorizes beyond the immediate task",
      },
      "soloLevel",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { soloLevel: "relational" } satisfies Input;
export const exampleOutput = {
  meaning: "response integrates relevant aspects into a coherent whole",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/solo-taxonomy-prestructural-extended-abstract-levels-lookup",
  title: "Solo Taxonomy Prestructural Extended Abstract Levels Lookup",
  description:
    "Biggs Collis SOLO descriptors, not automatic response grading. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ soloLevel: value.soloLevel as string }),
});
export const run = tool.execute;
export default tool;
