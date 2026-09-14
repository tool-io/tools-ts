import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIceDensity: number;
  readonly callerGravity: number;
  readonly actualIceThickness: number;
  readonly actualSlopeDegrees: number;
  readonly callerIndependentShapeFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualIceDensity", label: "Actual ice density", kind: "number" },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  { id: "actualIceThickness", label: "Actual ice thickness", kind: "number" },
  { id: "actualSlopeDegrees", label: "Actual slope degrees", kind: "number" },
  {
    id: "callerIndependentShapeFactor",
    label: "Caller independent shape factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualIceDensity, "actualIceDensity");
  positive(input.callerGravity, "callerGravity");
  nonnegative(input.actualIceThickness, "actualIceThickness");
  fraction(input.callerIndependentShapeFactor, "callerIndependentShapeFactor");
  if (input.actualSlopeDegrees < 0 || input.actualSlopeDegrees > 90)
    simpleError("slope", "0…90degrees.");
  return {
    value:
      input.actualIceDensity *
      input.callerGravity *
      input.actualIceThickness *
      Math.sin((input.actualSlopeDegrees * Math.PI) / 180) *
      input.callerIndependentShapeFactor,
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
    actualIceDensity: 1,
    callerGravity: 1,
    actualIceThickness: 1,
    actualSlopeDegrees: 30,
    callerIndependentShapeFactor: 1,
  },
  output: { result: { value: 0.49999999999999994 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/driving-stress-calculator",
  title: "Driving Stress Calculator",
  description:
    "Restrictedlocalshape-adjustedslabdrivingstress\u03c1gHsin\u03b1f,no invertthicknessor longitudinal/bridging stresses. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
