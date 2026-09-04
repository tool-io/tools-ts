import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, cdfRanks } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerMatchedPinchStrengthPopulation: readonly number[];
  readonly observedPinchStrength: number;
}>;
export type Output = Readonly<{
  readonly empiricalMidrankPercentile: number;
  readonly referenceCount: number;
}>;
const inputFields = [
  {
    id: "callerMatchedPinchStrengthPopulation",
    label: "Caller matched pinch strength population",
    kind: "numberList",
  },
  {
    id: "observedPinchStrength",
    label: "Observed pinch strength",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return cdfRanks(
    input.callerMatchedPinchStrengthPopulation,
    input.observedPinchStrength,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedPinchStrengthPopulation: [1, 2, 3, 4],
  observedPinchStrength: 2,
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
  id: "ergonomics/pinch-strength-percentile-estimate",
  title: "Pinch Grip Strength Percentile Estimate Calculator",
  description:
    "Empirical midrank percentile for actual PinchStrength against independently matched protocol/side/age population; not normally distributed assumption or inferred clinical impairment. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerMatchedPinchStrengthPopulation:
        value.callerMatchedPinchStrengthPopulation as readonly number[],
      observedPinchStrength: value.observedPinchStrength as number,
    }),
});
export const run = tool.execute;
export default tool;
