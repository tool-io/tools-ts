import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualEastLongitudeDegrees: number;
  readonly callerEastStandardMeridianDegrees: number;
  readonly callerIndependentEquationOfTimeMinutes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEastLongitudeDegrees",
    label: "Actual east longitude degrees",
    kind: "number",
  },
  {
    id: "callerEastStandardMeridianDegrees",
    label: "Caller east standard meridian degrees",
    kind: "number",
  },
  {
    id: "callerIndependentEquationOfTimeMinutes",
    label: "Caller independent equation of time minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (
    Math.abs(input.actualEastLongitudeDegrees) > 180 ||
    Math.abs(input.callerEastStandardMeridianDegrees) > 180
  )
    simpleError("longitude", "±180eastpositive.");
  return {
    value:
      720 -
      4 *
        (input.actualEastLongitudeDegrees -
          input.callerEastStandardMeridianDegrees) -
      input.callerIndependentEquationOfTimeMinutes,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualEastLongitudeDegrees: 5,
    callerEastStandardMeridianDegrees: 0,
    callerIndependentEquationOfTimeMinutes: -10,
  },
  output: { result: { value: 710 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/solar-noon-equation-of-time-correction",
  title: "Solar Noon Equation-of-Time Correction",
  description:
    "Declaredlocalsolarnoonminutesafterlocalstandardmidnight=720\u22124(\u03bb\u2212\u03bbzone)\u2212EOT,true-minusmeanEOTpositiveSunfast;DSTexcluded. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
