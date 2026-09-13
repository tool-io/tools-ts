import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTransverseDiameter: number;
  readonly actualCenterDistance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTransverseDiameter",
    label: "Actual transverse diameter",
    kind: "number",
  },
  {
    id: "actualCenterDistance",
    label: "Actual center distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualTransverseDiameter, "actualTransverseDiameter");
  positive(input.actualCenterDistance, "actualCenterDistance");
  return {
    value:
      (2 *
        Math.atan(
          input.actualTransverseDiameter / (2 * input.actualCenterDistance),
        ) *
        180) /
      Math.PI,
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
  input: { actualTransverseDiameter: 2, actualCenterDistance: 1 },
  output: { result: { value: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/angular-size-from-diameter-distance",
  title: "Angular Size From Diameter and Distance",
  description:
    "Exactplanartransversediskatanangulardiameter,degrees,diametercenterlineplaneperpendicularLOS;NOTsphericallimb2asin(R/d)orsmallangle. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
