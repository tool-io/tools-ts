import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, haAngle } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLatitudeDegrees: number;
  readonly actualDeclinationDegrees: number;
  readonly callerIndependentCrossingAltitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
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
  {
    id: "callerIndependentCrossingAltitudeDegrees",
    label: "Caller independent crossing altitude degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return haAngle(
    input.actualLatitudeDegrees,
    input.actualDeclinationDegrees,
    input.callerIndependentCrossingAltitudeDegrees,
  );
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
    actualLatitudeDegrees: 0,
    actualDeclinationDegrees: 0,
    callerIndependentCrossingAltitudeDegrees: 0,
  },
  output: { result: { hourAngleDegrees: 90, condition: "crossing" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/rise-set-hour-angle-formula",
  title: "Rise/Set Hour Angle Formula",
  description:
    "Geometricrissethourangleatanarccosrelationfromindependentactualdec/latitude/crossingaltitude,retainsnever/alwaysflags,nodateephemeris. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
