import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly poppingFamily: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "poppingFamily", label: "Popping family", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.poppingFamily,
      {
        popping:
          "rhythmic muscle-contraction accents within the named dance tradition",
        ticking: "small segmented rhythmic accents",
        waving: "illusion of a wave passing through body segments",
      },
      "poppingFamily",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { poppingFamily: "waving" } satisfies Input;
export const exampleOutput = {
  meaning: "illusion of a wave passing through body segments",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/popping-ticking-waving-family-tree-lookup",
  title: "Popping Ticking Waving Family Tree Lookup",
  description:
    "Bounded movement-vocabulary descriptors, not complete genealogy, audio classification or technique instruction. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ poppingFamily: value.poppingFamily as string }),
});
export const run = tool.execute;
export default tool;
