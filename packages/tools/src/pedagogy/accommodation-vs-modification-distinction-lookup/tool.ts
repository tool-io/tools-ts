import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly plannedChange: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "plannedChange", label: "Planned change", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.plannedChange,
      {
        "access-method":
          "accommodation: changes access or demonstration method without changing the intended learning target",
        "learning-target":
          "modification: changes the intended learning target or expected content",
        unknown:
          "insufficient independently established target evidence to distinguish",
      },
      "plannedChange",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { plannedChange: "access-method" } satisfies Input;
export const exampleOutput = {
  meaning:
    "accommodation: changes access or demonstration method without changing the intended learning target",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/accommodation-vs-modification-distinction-lookup",
  title: "Accommodation vs Modification Distinction Lookup",
  description:
    "Distinguish declared target change from access change; neither test format or diagnosis alone establishes applicability. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ plannedChange: value.plannedChange as string }),
});
export const run = tool.execute;
export default tool;
