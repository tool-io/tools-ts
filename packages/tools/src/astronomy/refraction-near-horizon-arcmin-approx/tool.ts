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
  readonly actualTrueAltitudeDegrees: number;
  readonly actualPressureHpa: number;
  readonly actualTemperatureC: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualTrueAltitudeDegrees",
    label: "Actual true altitude degrees",
    kind: "number",
  },
  { id: "actualPressureHpa", label: "Actual pressure hpa", kind: "number" },
  { id: "actualTemperatureC", label: "Actual temperature c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualPressureHpa, "actualPressureHpa");
  if (
    input.actualTrueAltitudeDegrees < 0 ||
    input.actualTrueAltitudeDegrees > 15 ||
    input.actualTemperatureC <= -100 ||
    input.actualTemperatureC > 60
  )
    simpleError("branch", "0…15° altitudeand−100<T≤60C.");
  return {
    value:
      (1.02 /
        Math.tan(
          ((input.actualTrueAltitudeDegrees +
            10.3 / (input.actualTrueAltitudeDegrees + 5.11)) *
            Math.PI) /
            180,
        )) *
      (input.actualPressureHpa / 1010) *
      (283 / (input.actualTemperatureC + 273)),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualTrueAltitudeDegrees: 0,
    actualPressureHpa: 1010,
    actualTemperatureC: 10,
  },
  output: { result: { value: 28.98192738444997 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/refraction-near-horizon-arcmin-approx",
  title: "Near-Horizon Refraction Arcmin Approximation",
  description:
    "DeclaredSaemundssonempiricaltruealtitude refractionapproxarcmin0\u2264h\u226415deg,P/Tscaled;actualTRUEaltitude,no precisionhorizon/weather guarantee. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
