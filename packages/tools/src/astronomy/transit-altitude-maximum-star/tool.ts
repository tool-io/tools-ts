import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLatitudeDegrees: number;
  readonly actualDeclinationDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLatitudeDegrees",
    label: "Actual latitude degrees",
    kind: "number",
  },
  {
    id: "actualDeclinationDegrees",
    label: "Actual declination degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (
    Math.abs(input.actualLatitudeDegrees) > 90 ||
    Math.abs(input.actualDeclinationDegrees) > 90
  )
    simpleError("angles", "±90degrees.");
  return {
    value:
      90 -
      Math.abs(input.actualLatitudeDegrees - input.actualDeclinationDegrees),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualLatitudeDegrees: 30, actualDeclinationDegrees: 20 },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/transit-altitude-maximum-star",
  title: "Maximum Transit Altitude Calculator",
  description:
    "Uppermeridianmaximumaltitude90\u2212|\u03c6\u2212\u03b4|,signednegativealtitudesretained,not assume allstarstransitabovehorizon. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
