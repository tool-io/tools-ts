import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, haAngle } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLatitudeDegrees: number;
  readonly callerIndependentSolarDeclinationDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLatitudeDegrees",
    label: "Actual latitude degrees",
    kind: "number",
  },
  {
    id: "callerIndependentSolarDeclinationDegrees",
    label: "Caller independent solar declination degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = haAngle(
      input.actualLatitudeDegrees,
      input.callerIndependentSolarDeclinationDegrees,
      -6,
    ),
    b = haAngle(
      input.actualLatitudeDegrees,
      input.callerIndependentSolarDeclinationDegrees,
      -4,
    );
  if (a.condition !== "crossing" || b.condition !== "crossing")
    return {
      declaredEveningWindowMinutes: 0,
      condition: "one-or-both-boundaries-not-crossed",
    };
  return {
    declaredEveningWindowMinutes: (a.hourAngleDegrees - b.hourAngleDegrees) * 4,
    condition: "both-boundaries-cross",
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
    actualLatitudeDegrees: 0,
    callerIndependentSolarDeclinationDegrees: 0,
  },
  output: {
    result: {
      declaredEveningWindowMinutes: 8,
      condition: "both-boundaries-cross",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/blue-hour-duration-latitude-lookup",
  title: "Blue Hour Duration By Latitude Lookup",
  description:
    "Explicittoy eveningblue\u22126\u2026\u22124\u00b0Sunwindowgeometricdurationfromactualindependentdeclination/latitude,not universalaestheticdefinitionor live ephemeris. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
