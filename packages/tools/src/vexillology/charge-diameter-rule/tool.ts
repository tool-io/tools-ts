import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualChargeDiameter: number;
  readonly actualFlagHoist: number;
  readonly callerIndependentMaximumDiameterHoistFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualChargeDiameter",
    label: "Actual charge diameter",
    kind: "number",
  },
  { id: "actualFlagHoist", label: "Actual flag hoist", kind: "number" },
  {
    id: "callerIndependentMaximumDiameterHoistFraction",
    label: "Caller independent maximum diameter hoist fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualChargeDiameter, "diameter");
  positive(input.actualFlagHoist, "hoist");
  fraction(input.callerIndependentMaximumDiameterHoistFraction, "fraction");
  const max =
    input.actualFlagHoist * input.callerIndependentMaximumDiameterHoistFraction;
  return {
    observedDiameterHoistFraction:
      input.actualChargeDiameter / input.actualFlagHoist,
    signedAllowedMinusActualDiameter: max - input.actualChargeDiameter,
    withinCallerChargeLimit: input.actualChargeDiameter <= max,
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
    actualChargeDiameter: 2,
    actualFlagHoist: 4,
    callerIndependentMaximumDiameterHoistFraction: 0.4,
  },
  output: {
    result: {
      observedDiameterHoistFraction: 0.5,
      signedAllowedMinusActualDiameter: -0.3999999999999999,
      withinCallerChargeLimit: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/charge-diameter-rule",
  title: "Charge Maximum Diameter Rule Checker",
  description:
    "Actualcharge/hoistmaxfractioncomparison,signedsizemargin,not universal flagdesign/code rule. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
