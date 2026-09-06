import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly harknessRole: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "harknessRole", label: "Harkness role", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.harknessRole,
      {
        participant:
          "contribute, listen, question and build on shared evidence around the discussion table",
        teacher:
          "facilitate access and reflective discussion rather than assume an uninterrupted lecture",
      },
      "harknessRole",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { harknessRole: "participant" } satisfies Input;
export const exampleOutput = {
  meaning:
    "contribute, listen, question and build on shared evidence around the discussion table",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/harkness-table-discussion-format-lookup",
  title: "Harkness Table Discussion Format Lookup",
  description:
    "Harkness format role principles, not universal room shape, table seating capacity or student quality score. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ harknessRole: value.harknessRole as string }),
});
export const run = tool.execute;
export default tool;
