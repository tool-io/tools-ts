import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCenterDistance: number;
  readonly actualAngularDiameterDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCenterDistance",
    label: "Actual center distance",
    kind: "number",
  },
  {
    id: "actualAngularDiameterDegrees",
    label: "Actual angular diameter degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualCenterDistance, "actualCenterDistance");
  nonnegative(
    input.actualAngularDiameterDegrees,
    "actualAngularDiameterDegrees",
  );
  if (input.actualAngularDiameterDegrees >= 180)
    simpleError("angle", "0≤θ<180degrees.");
  return {
    value:
      2 *
      input.actualCenterDistance *
      Math.tan((input.actualAngularDiameterDegrees * Math.PI) / 360),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualCenterDistance: 1, actualAngularDiameterDegrees: 90 },
  output: { result: { value: 1.9999999999999998 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/physical-size-from-angular-distance",
  title: "Physical Size From Angular Size and Distance",
  description:
    "Inverseplanartransversediskangulardiameteratanprojection,0\u2264\u03b8<180,no sphericalarcsinlimb/distanceinference. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
