import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFinishedFlagHoist: number;
  readonly actualFinishedFlagFly: number;
  readonly actualStripeColorLabels: readonly string[];
  readonly callerIndependentlyChosenStripeHoistWeights: readonly number[];
  readonly callerActualInternalSeamAllowance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFinishedFlagHoist",
    label: "Actual finished flag hoist",
    kind: "number",
  },
  {
    id: "actualFinishedFlagFly",
    label: "Actual finished flag fly",
    kind: "number",
  },
  {
    id: "actualStripeColorLabels",
    label: "Actual stripe color labels",
    kind: "stringList",
  },
  {
    id: "callerIndependentlyChosenStripeHoistWeights",
    label: "Caller independently chosen stripe hoist weights",
    kind: "numberList",
  },
  {
    id: "callerActualInternalSeamAllowance",
    label: "Caller actual internal seam allowance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualFinishedFlagHoist, "H");
  positive(input.actualFinishedFlagFly, "F");
  aligned(
    input.actualStripeColorLabels,
    input.callerIndependentlyChosenStripeHoistWeights,
    "stripes",
  );
  input.callerIndependentlyChosenStripeHoistWeights.forEach((v) =>
    positive(v, "weight"),
  );
  nonnegative(input.callerActualInternalSeamAllowance, "seam");
  const a = input.callerIndependentlyChosenStripeHoistWeights,
    t = sum(a);
  return {
    stripeCutHoists: a.map(
      (v, i) =>
        (input.actualFinishedFlagHoist * v) / t +
        input.callerActualInternalSeamAllowance *
          ((i > 0 ? 1 : 0) + (i < a.length - 1 ? 1 : 0)),
    ),
    stripeCutFlies: a.map(() => input.actualFinishedFlagFly),
    stripeColorLabels: [...input.actualStripeColorLabels],
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
    actualFinishedFlagHoist: 6,
    actualFinishedFlagFly: 3,
    actualStripeColorLabels: ["a", "b", "a"],
    callerIndependentlyChosenStripeHoistWeights: [1, 2, 3],
    callerActualInternalSeamAllowance: 0.1,
  },
  output: {
    result: {
      stripeCutHoists: [1.1, 2.2, 3.1],
      stripeCutFlies: [3, 3, 3],
      stripeColorLabels: ["a", "b", "a"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/stripe-panel-cut-list",
  title: "Sewn Stripe Panel Cut List Generator",
  description:
    "ActualunequalhorizontalstripecutlistwithallowancesbothsidesINTERNALseams,externalhemexcluded;no optimizenesting/colorhistoricaldesign. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
