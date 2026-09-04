import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, cdfRanks } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerMatchedGripStrengthPopulation: readonly number[];
  readonly observedGripStrength: number;
}>;
export type Output = Readonly<{
  readonly empiricalMidrankPercentile: number;
  readonly referenceCount: number;
}>;
const inputFields = [
  {
    id: "callerMatchedGripStrengthPopulation",
    label: "Caller matched grip strength population",
    kind: "numberList",
  },
  {
    id: "observedGripStrength",
    label: "Observed grip strength",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return cdfRanks(
    input.callerMatchedGripStrengthPopulation,
    input.observedGripStrength,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedGripStrengthPopulation: [1, 2, 3, 4],
  observedGripStrength: 2,
} satisfies Input;
export const exampleOutput = {
  empiricalMidrankPercentile: 37.5,
  referenceCount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/grip-strength-percentile-estimate",
  title: "Grip Strength Percentile Estimate Calculator",
  description:
    "Empirical midrank percentile for actual GripStrength against independently matched protocol/side/age population; not normally distributed assumption or inferred clinical impairment. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "empiricalMidrankPercentile",
      label: "Empirical midrank percentile",
      kind: "number",
    },
    { id: "referenceCount", label: "Reference count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedGripStrengthPopulation:
        value.callerMatchedGripStrengthPopulation as readonly number[],
      observedGripStrength: value.observedGripStrength as number,
    }),
});
export const run = tool.execute;
export default tool;
