import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PressureSensorAccuracyInput = Readonly<{
  readonly fullScaleSpanPa: number;
  readonly accuracyPercentFullScale: number;
}>;
export type PressureSensorAccuracyOutput = Readonly<{
  readonly maximumErrorPa: number;
}>;

export const calculatePressureSensorAccuracy = (
  x: PressureSensorAccuracyInput,
): PressureSensorAccuracyOutput => {
  if (!Number.isFinite(x.fullScaleSpanPa) || x.fullScaleSpanPa < 0)
    simpleError("fullScaleSpanPa", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.accuracyPercentFullScale) ||
    x.accuracyPercentFullScale < 0
  )
    simpleError(
      "accuracyPercentFullScale",
      "Provide a finite number at least 0.",
    );
  const maximumErrorPa = (x.fullScaleSpanPa * x.accuracyPercentFullScale) / 100;
  if (!Number.isFinite(maximumErrorPa))
    simpleError("maximumErrorPa", "The inputs produce an invalid result.");
  return { maximumErrorPa: Object.is(maximumErrorPa, -0) ? 0 : maximumErrorPa };
};

export const example = {
  input: { fullScaleSpanPa: 100000, accuracyPercentFullScale: 1 },
  output: { maximumErrorPa: 1000 },
} satisfies ToolExample<
  PressureSensorAccuracyInput,
  PressureSensorAccuracyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pressure-sensor-accuracy",
  title: "Pressure Sensor Accuracy",
  description:
    "Convert a pressure sensor's accuracy rating as percent of full-scale span into absolute pressure error.",
  inputs: [
    {
      id: "fullScaleSpanPa",
      kind: "number",
      label: "Full-scale pressure span",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "accuracyPercentFullScale",
      kind: "number",
      label: "Accuracy rating",
      unit: "%FS",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maximumErrorPa",
      kind: "number",
      label: "Rated maximum error",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculatePressureSensorAccuracy({
      fullScaleSpanPa: input.fullScaleSpanPa as number,
      accuracyPercentFullScale: input.accuracyPercentFullScale as number,
    }),
});
export const pressureSensorAccuracyTool = tool;
export const runPressureSensorAccuracy = tool.execute;
export default tool;
