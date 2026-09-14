import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFlyLength: number;
  readonly callerVerifiedHoistRatioUnits: number;
  readonly callerVerifiedFlyRatioUnits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFlyLength", label: "Actual fly length", kind: "number" },
  {
    id: "callerVerifiedHoistRatioUnits",
    label: "Caller verified hoist ratio units",
    kind: "number",
  },
  {
    id: "callerVerifiedFlyRatioUnits",
    label: "Caller verified fly ratio units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualFlyLength, "actualFlyLength");
  positive(
    input.callerVerifiedHoistRatioUnits,
    "callerVerifiedHoistRatioUnits",
  );
  positive(input.callerVerifiedFlyRatioUnits, "callerVerifiedFlyRatioUnits");
  return {
    value:
      (input.actualFlyLength * input.callerVerifiedHoistRatioUnits) /
      input.callerVerifiedFlyRatioUnits,
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
    actualFlyLength: 3,
    callerVerifiedHoistRatioUnits: 2,
    callerVerifiedFlyRatioUnits: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/hoist-from-fly-ratio",
  title: "Flag Hoist from Fly and Ratio Calculator",
  description:
    "InverseactualflaghoistfromactualflyandindependentlyqualifiedH:F ratio,no historicalratiodetermination. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
