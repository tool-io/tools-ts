import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly comparisonBasis: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "comparisonBasis", label: "Comparison basis", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.comparisonBasis,
      {
        criterion:
          "performance compared with independently specified achievement criteria",
        norm: "performance compared with a defined reference population",
        both: "report criterion achievement separately from reference-population standing",
      },
      "comparisonBasis",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { comparisonBasis: "criterion" } satisfies Input;
export const exampleOutput = {
  meaning:
    "performance compared with independently specified achievement criteria",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/criterion-norm-referenced-grading-distinction-lookup",
  title: "Criterion Norm Referenced Grading Distinction Lookup",
  description:
    "Distinguish criterion/norm reference from actual reported assessment comparison basis, not interpret unprovided norms. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ comparisonBasis: value.comparisonBasis as string }),
});
export const run = tool.execute;
export default tool;
