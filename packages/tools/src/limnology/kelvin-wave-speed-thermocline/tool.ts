import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerGravity: number;
  readonly actualPositiveLowerMinusUpperDensity: number;
  readonly callerMeanReferenceDensity: number;
  readonly actualUpperLayerDepth: number;
  readonly actualLowerLayerDepth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualPositiveLowerMinusUpperDensity",
    label: "Actual positive lower minus upper density",
    kind: "number",
  },
  {
    id: "callerMeanReferenceDensity",
    label: "Caller mean reference density",
    kind: "number",
  },
  {
    id: "actualUpperLayerDepth",
    label: "Actual upper layer depth",
    kind: "number",
  },
  {
    id: "actualLowerLayerDepth",
    label: "Actual lower layer depth",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.callerGravity, "callerGravity");
  positive(
    input.actualPositiveLowerMinusUpperDensity,
    "actualPositiveLowerMinusUpperDensity",
  );
  positive(input.callerMeanReferenceDensity, "callerMeanReferenceDensity");
  positive(input.actualUpperLayerDepth, "actualUpperLayerDepth");
  positive(input.actualLowerLayerDepth, "actualLowerLayerDepth");
  return {
    value: Math.sqrt(
      (((input.callerGravity * input.actualPositiveLowerMinusUpperDensity) /
        input.callerMeanReferenceDensity) *
        input.actualUpperLayerDepth *
        input.actualLowerLayerDepth) /
        (input.actualUpperLayerDepth + input.actualLowerLayerDepth),
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
    actualPositiveLowerMinusUpperDensity: 2,
    callerMeanReferenceDensity: 1,
    actualUpperLayerDepth: 1,
    actualLowerLayerDepth: 1,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/kelvin-wave-speed-thermocline",
  title: "Kelvin Wave Speed Thermocline Calculator",
  description:
    "Idealnonrotatinglonginternaltwo-layerKelvinwavespeed\u221a(g\u2032h1h2/(h1+h2)),rigidlid/sharpthermocline,not seicheperiod. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
