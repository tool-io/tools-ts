import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedFirstAttemptSends: number;
  readonly actualEligibleFirstAttempts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedFirstAttemptSends",
    label: "Actual independently qualified first attempt sends",
    kind: "number",
  },
  {
    id: "actualEligibleFirstAttempts",
    label: "Actual eligible first attempts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyQualifiedFirstAttemptSends,
    "actualIndependentlyQualifiedFirstAttemptSends",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleFirstAttempts,
    "actualEligibleFirstAttempts",
    1,
    1000000,
  );
  if (
    input.actualIndependentlyQualifiedFirstAttemptSends >
    input.actualEligibleFirstAttempts
  )
    simpleError("sends", "Actualsubset≤attempts.");
  return {
    value:
      (100 * input.actualIndependentlyQualifiedFirstAttemptSends) /
      input.actualEligibleFirstAttempts,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyQualifiedFirstAttemptSends: 2,
    actualEligibleFirstAttempts: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/bouldering-send-rate-flash-percent",
  title: "Bouldering Flash Send Rate Percent",
  description:
    "ActualsamecohortboulderingFLASHsends/first-attemptopportunities,not later-send successor predictedskill. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
