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
    0,
  );
  return {
    geometricDaylightHours: (a.hourAngleDegrees * 2) / 15,
    condition: a.condition,
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
  output: { result: { geometricDaylightHours: 12, condition: "crossing" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/daylight-duration-latitude",
  title: "Daylight Duration Latitude Calculator",
  description:
    "Geometriccenter-of-Sunzeroaltitudedaylengthfromactualindependentdeclination,polarflagsretained,no refraction/ephemeris/cloudsunshine. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
