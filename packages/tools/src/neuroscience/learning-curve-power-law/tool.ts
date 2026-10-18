import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedAsymptoticTimeSeconds: number;
  readonly callerCalibratedExcessTimeSeconds: number;
  readonly callerCalibratedPracticeExponent: number;
  readonly actualPositivePracticeTrialNumber: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerCalibratedAsymptoticTimeSeconds",
    label: "Caller calibrated asymptotic time seconds",
    kind: "number",
  },
  {
    id: "callerCalibratedExcessTimeSeconds",
    label: "Caller calibrated excess time seconds",
    kind: "number",
  },
  {
    id: "callerCalibratedPracticeExponent",
    label: "Caller calibrated practice exponent",
    kind: "number",
  },
  {
    id: "actualPositivePracticeTrialNumber",
    label: "Actual positive practice trial number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.callerCalibratedAsymptoticTimeSeconds, "asymptote");
  nonnegative(input.callerCalibratedExcessTimeSeconds, "excess");
  nonnegative(input.callerCalibratedPracticeExponent, "exponent");
  bounded(input.actualPositivePracticeTrialNumber, "trial", 1, 1000000000);
  return {
    conditionalPredictedTaskTimeSeconds:
      input.callerCalibratedAsymptoticTimeSeconds +
      input.callerCalibratedExcessTimeSeconds *
        input.actualPositivePracticeTrialNumber **
          -input.callerCalibratedPracticeExponent,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedAsymptoticTimeSeconds: 1,
    callerCalibratedExcessTimeSeconds: 8,
    callerCalibratedPracticeExponent: 1,
    actualPositivePracticeTrialNumber: 2,
  },
  output: { result: { conditionalPredictedTaskTimeSeconds: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/learning-curve-power-law",
  title: "Power Law of Practice Calculator",
  description:
    "Explicit caller-calibrated practice-power model T(n)=A+B*n^-c; no coefficients fabricated or fitted automatically. Assumes model applicability, not universal learning rate, ability or clinical improvement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalPredictedTaskTimeSeconds: { type: "number" } },
        required: ["conditionalPredictedTaskTimeSeconds"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
