import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagnetometerResolutionInput = Readonly<{
  readonly fullScaleSpanMicrotesla: number;
  readonly resolutionBits: number;
}>;
export type MagnetometerResolutionOutput = Readonly<{
  readonly codeStepMicrotesla: number;
}>;

export const calculateMagnetometerResolution = (
  x: MagnetometerResolutionInput,
): MagnetometerResolutionOutput => {
  if (
    !Number.isFinite(x.fullScaleSpanMicrotesla) ||
    x.fullScaleSpanMicrotesla < 0
  )
    simpleError(
      "fullScaleSpanMicrotesla",
      "Provide a finite number at least 0.",
    );
  if (!Number.isSafeInteger(x.resolutionBits) || x.resolutionBits < 1)
    simpleError("resolutionBits", "Provide a safe integer at least 1.");
  if (!(x.resolutionBits <= 24))
    simpleError("resolutionBits", "Resolution must not exceed 24 bits.");
  const codeStepMicrotesla = x.fullScaleSpanMicrotesla / 2 ** x.resolutionBits;
  if (!Number.isFinite(codeStepMicrotesla))
    simpleError("codeStepMicrotesla", "The inputs produce an invalid result.");
  return {
    codeStepMicrotesla: Object.is(codeStepMicrotesla, -0)
      ? 0
      : codeStepMicrotesla,
  };
};

export const example = {
  input: { fullScaleSpanMicrotesla: 200, resolutionBits: 10 },
  output: { codeStepMicrotesla: 0.1953125 },
} satisfies ToolExample<
  MagnetometerResolutionInput,
  MagnetometerResolutionOutput
>;

export const tool = createSimpleTool({
  id: "electronics/magnetometer-resolution",
  title: "Magnetometer Resolution",
  description:
    "Estimate one ideal ADC code step in magnetic field from full-scale span and bit resolution; excludes sensor noise.",
  inputs: [
    {
      id: "fullScaleSpanMicrotesla",
      kind: "number",
      label: "Full-scale span",
      unit: "µT",
      minimum: 0,
    },
    {
      id: "resolutionBits",
      kind: "integer",
      label: "Converter resolution",
      unit: "bit",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "codeStepMicrotesla",
      kind: "number",
      label: "Ideal code step",
      unit: "µT",
    },
  ],
  calculate: (input) =>
    calculateMagnetometerResolution({
      fullScaleSpanMicrotesla: input.fullScaleSpanMicrotesla as number,
      resolutionBits: input.resolutionBits as number,
    }),
});
export const magnetometerResolutionTool = tool;
export const runMagnetometerResolution = tool.execute;
export default tool;
