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
  readonly callerGravity: number;
  readonly callerReferenceDensity: number;
  readonly actualLowerWaterDensity: number;
  readonly actualUpperWaterDensity: number;
  readonly actualVerticalSeparationMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "callerReferenceDensity",
    label: "Caller reference density",
    kind: "number",
  },
  {
    id: "actualLowerWaterDensity",
    label: "Actual lower water density",
    kind: "number",
  },
  {
    id: "actualUpperWaterDensity",
    label: "Actual upper water density",
    kind: "number",
  },
  {
    id: "actualVerticalSeparationMeters",
    label: "Actual vertical separation meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.callerGravity, "callerGravity");
  positive(input.callerReferenceDensity, "callerReferenceDensity");
  positive(input.actualLowerWaterDensity, "actualLowerWaterDensity");
  positive(input.actualUpperWaterDensity, "actualUpperWaterDensity");
  positive(
    input.actualVerticalSeparationMeters,
    "actualVerticalSeparationMeters",
  );
  if (input.actualLowerWaterDensity < input.actualUpperWaterDensity)
    simpleError("density", "Stableprofileonly,N²negativecannotreturnrealN.");
  return {
    value: Math.sqrt(
      ((input.callerGravity / input.callerReferenceDensity) *
        (input.actualLowerWaterDensity - input.actualUpperWaterDensity)) /
        input.actualVerticalSeparationMeters,
    ),
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
    callerGravity: 1,
    callerReferenceDensity: 10,
    actualLowerWaterDensity: 2,
    actualUpperWaterDensity: 1,
    actualVerticalSeparationMeters: 1,
  },
  output: { result: { value: 0.31622776601683794 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/brunt-vaisala-frequency-thermocline",
  title: "Brunt Vaisala Frequency Thermocline Calculator",
  description:
    "ActualstablewaterfinitegradientBrunt\u2013V\u00e4is\u00e4l\u00e4N\u221a(g/\u03c1ref\u00d7\u0394\u03c1/\u0394z),positive-downwaterdensitynot atmospheric\u03b8gradient. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
