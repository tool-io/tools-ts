import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly seminarRole: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "seminarRole", label: "Seminar role", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.seminarRole,
      {
        inner:
          "participate in text-grounded dialogue under agreed turn and evidence norms",
        outer:
          "observe using declared look-fors and prepare specific evidence-based feedback",
        facilitator:
          "support access and norms without replacing learner reasoning",
      },
      "seminarRole",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { seminarRole: "outer" } satisfies Input;
export const exampleOutput = {
  meaning:
    "observe using declared look-fors and prepare specific evidence-based feedback",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/socratic-seminar-inner-outer-circle-facilitation-guide",
  title: "Socratic Seminar Inner Outer Circle Facilitation Guide",
  description:
    "Socratic inner/outer seminar roles not fixed grouping ratio or authority to pressure participation. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ seminarRole: value.seminarRole as string }),
});
export const run = tool.execute;
export default tool;
