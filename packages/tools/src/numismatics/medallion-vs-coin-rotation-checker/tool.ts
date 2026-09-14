import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedReverseRotationFromObverseDegrees: number;
  readonly callerIndependentAlignmentToleranceDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedReverseRotationFromObverseDegrees",
    label: "Actual observed reverse rotation from obverse degrees",
    kind: "number",
  },
  {
    id: "callerIndependentAlignmentToleranceDegrees",
    label: "Caller independent alignment tolerance degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!Number.isFinite(input.actualObservedReverseRotationFromObverseDegrees))
    simpleError("angle", "Finiteactualrotation.");
  nonnegative(input.callerIndependentAlignmentToleranceDegrees, "tolerance");
  if (input.callerIndependentAlignmentToleranceDegrees >= 90)
    simpleError("tolerance", "Resolvedtolerance<90.");
  const a =
    ((input.actualObservedReverseRotationFromObverseDegrees % 360) + 360) % 360;
  return {
    coinAlignmentMatch:
      Math.abs(a - 180) <= input.callerIndependentAlignmentToleranceDegrees,
    medalAlignmentMatch:
      Math.min(a, 360 - a) <= input.callerIndependentAlignmentToleranceDegrees,
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
    actualObservedReverseRotationFromObverseDegrees: 180,
    callerIndependentAlignmentToleranceDegrees: 2,
  },
  output: { result: { coinAlignmentMatch: true, medalAlignmentMatch: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/medallion-vs-coin-rotation-checker",
  title: "Medallion vs Coin Rotation Checker",
  description:
    "Observedcoin180\u00b0versusmedal0\u00b0alignment undercallermeasurementtolerance,not authenticity/issuemintstandard.",
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
