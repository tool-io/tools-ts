import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDeclinationDegrees: number;
  readonly callerActualDetectorArcsecondsPerPixel: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDeclinationDegrees",
    label: "Actual declination degrees",
    kind: "number",
  },
  {
    id: "callerActualDetectorArcsecondsPerPixel",
    label: "Caller actual detector arcseconds per pixel",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.callerActualDetectorArcsecondsPerPixel,
    "callerActualDetectorArcsecondsPerPixel",
  );
  if (Math.abs(input.actualDeclinationDegrees) > 90)
    simpleError("dec", "±90degrees.");
  return {
    value:
      ((360 / 86164.0905) *
        3600 *
        60 *
        Math.abs(Math.cos((input.actualDeclinationDegrees * Math.PI) / 180))) /
      input.callerActualDetectorArcsecondsPerPixel,
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
    actualDeclinationDegrees: 0,
    callerActualDetectorArcsecondsPerPixel: 1,
  },
  output: { result: { value: 902.4641187386524 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/star-trail-length-pixels-per-minute",
  title: "Star Trail Length Pixels Per Minute",
  description:
    "SiderealrotationtrailRATEpixels/minute atactualdeclinationfixednontrackingdetectorlocaltangentplane,not generic observedmoving-sourcemotion. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
