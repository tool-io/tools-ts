import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{ readonly asymmetryDegrees: number }>;
export type Output = Readonly<{ readonly asymmetryMultiplier: number }>;
const inputFields = [
  { id: "asymmetryDegrees", label: "Asymmetry degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.asymmetryDegrees < 0 || input.asymmetryDegrees > 135)
    simpleError("A", "RNLE 0..135 degrees.");
  return { asymmetryMultiplier: 1 - 0.0032 * input.asymmetryDegrees };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { asymmetryDegrees: 100 } satisfies Input;
export const exampleOutput = { asymmetryMultiplier: 0.68 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-asymmetry-multiplier",
  title: "NIOSH Asymmetry Multiplier Lookup",
  description:
    "RNLE actual asymmetry-plane angle multiplier1−.0032A, not measured trunk torque. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "asymmetryMultiplier",
      label: "Asymmetry multiplier",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ asymmetryDegrees: value.asymmetryDegrees as number }),
});
export const run = tool.execute;
export default tool;
