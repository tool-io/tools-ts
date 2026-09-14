import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyEstablishedFitnessCtl: number;
  readonly actualIndependentlyEstablishedFatigueAtl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyEstablishedFitnessCtl",
    label: "Actual independently established fitness ctl",
    kind: "number",
  },
  {
    id: "actualIndependentlyEstablishedFatigueAtl",
    label: "Actual independently established fatigue atl",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    value:
      input.actualIndependentlyEstablishedFitnessCtl -
      input.actualIndependentlyEstablishedFatigueAtl,
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
    actualIndependentlyEstablishedFitnessCtl: 10,
    actualIndependentlyEstablishedFatigueAtl: 5,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/freshness-form-tsb-fitness-minus-fatigue",
  title: "TSB Freshness Form Fitness-Fatigue Calculator",
  description:
    "ObservedTSBfitnessCTLminusfatigueATLsame independentlyspecifiedtimeorigin/scales,not calibratedstateupdate or readinessapproval. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
