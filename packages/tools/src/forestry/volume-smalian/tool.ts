import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VolumeSmalianInput = Readonly<{
  readonly smallEndAreaSquareMeters: number;
  readonly largeEndAreaSquareMeters: number;
  readonly logLengthMeters: number;
}>;
export type VolumeSmalianOutput = Readonly<{
  readonly logCubicMeters: number;
}>;

export const calculateVolumeSmalian = (
  x: VolumeSmalianInput,
): VolumeSmalianOutput => {
  if (
    !Number.isFinite(x.smallEndAreaSquareMeters) ||
    x.smallEndAreaSquareMeters < 0
  )
    simpleError(
      "smallEndAreaSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.largeEndAreaSquareMeters) ||
    x.largeEndAreaSquareMeters < 0
  )
    simpleError(
      "largeEndAreaSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.logLengthMeters) || x.logLengthMeters < 0)
    simpleError("logLengthMeters", "Provide a finite nonnegative number.");
  const logCubicMeters =
    ((x.smallEndAreaSquareMeters + x.largeEndAreaSquareMeters) *
      x.logLengthMeters) /
    2;
  if (!Number.isFinite(logCubicMeters))
    simpleError(
      "logCubicMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { logCubicMeters: Object.is(logCubicMeters, -0) ? 0 : logCubicMeters };
};

export const example = {
  input: {
    smallEndAreaSquareMeters: 0.08,
    largeEndAreaSquareMeters: 0.12,
    logLengthMeters: 4,
  },
  output: { logCubicMeters: 0.4 },
} satisfies ToolExample<VolumeSmalianInput, VolumeSmalianOutput>;

export const tool = createSimpleTool({
  id: "forestry/volume-smalian",
  title: "Volume Smalian",
  description:
    "Log volume by Smalian's rule: mean of the two end cross-sectional areas times log length.",
  inputs: [
    {
      id: "smallEndAreaSquareMeters",
      kind: "number",
      label: "Small End Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "largeEndAreaSquareMeters",
      kind: "number",
      label: "Large End Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "logLengthMeters",
      kind: "number",
      label: "Log Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "logCubicMeters",
      kind: "number",
      label: "Log Cubic Meters",
      unit: "m3",
    },
  ],
  calculate: (input) =>
    calculateVolumeSmalian({
      smallEndAreaSquareMeters: input.smallEndAreaSquareMeters as number,
      largeEndAreaSquareMeters: input.largeEndAreaSquareMeters as number,
      logLengthMeters: input.logLengthMeters as number,
    }),
});
export const volumeSmalianTool = tool;
export const runVolumeSmalian = tool.execute;
export default tool;
