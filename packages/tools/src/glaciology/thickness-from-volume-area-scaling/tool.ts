import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerActualVolumeAreaCoefficient: number;
  readonly actualGlacierArea: number;
  readonly callerActualVolumeAreaExponent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerActualVolumeAreaCoefficient",
    label: "Caller actual volume area coefficient",
    kind: "number",
  },
  { id: "actualGlacierArea", label: "Actual glacier area", kind: "number" },
  {
    id: "callerActualVolumeAreaExponent",
    label: "Caller actual volume area exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.callerActualVolumeAreaCoefficient,
    "callerActualVolumeAreaCoefficient",
  );
  positive(input.actualGlacierArea, "actualGlacierArea");
  return {
    value:
      input.callerActualVolumeAreaCoefficient *
      input.actualGlacierArea ** (input.callerActualVolumeAreaExponent - 1),
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
    callerActualVolumeAreaCoefficient: 1,
    actualGlacierArea: 2,
    callerActualVolumeAreaExponent: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/thickness-from-volume-area-scaling",
  title: "Thickness From Volume Area Scaling Calculator",
  description:
    "ConditionalV=cA^\u03b3dividedbyarea formeanthickness,cunitssameV/Abasis,no fabricatedmeasuredglacierthickness. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
