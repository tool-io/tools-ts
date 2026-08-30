import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TangentialModeFrequencyInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly orderX: number;
  readonly orderY: number;
  readonly lengthXMeters: number;
  readonly lengthYMeters: number;
}>;
export type TangentialModeFrequencyOutput = Readonly<{
  readonly modeHertz: number;
}>;

export const calculateTangentialModeFrequency = (
  x: TangentialModeFrequencyInput,
): TangentialModeFrequencyOutput => {
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.orderX) ||
    !Number.isSafeInteger(x.orderX) ||
    x.orderX < 1
  )
    simpleError("orderX", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.orderY) ||
    !Number.isSafeInteger(x.orderY) ||
    x.orderY < 1
  )
    simpleError("orderY", "Provide a positive safe integer.");
  if (!Number.isFinite(x.lengthXMeters) || x.lengthXMeters <= 0)
    simpleError("lengthXMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.lengthYMeters) || x.lengthYMeters <= 0)
    simpleError("lengthYMeters", "Provide a finite positive number.");
  const modeHertz =
    (x.soundSpeedMetersPerSecond / 2) *
    Math.hypot(x.orderX / x.lengthXMeters, x.orderY / x.lengthYMeters);
  if (!Number.isFinite(modeHertz))
    simpleError(
      "modeHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { modeHertz: Object.is(modeHertz, -0) ? 0 : modeHertz };
};

export const example = {
  input: {
    soundSpeedMetersPerSecond: 343,
    orderX: 1,
    orderY: 1,
    lengthXMeters: 5,
    lengthYMeters: 4,
  },
  output: { modeHertz: 54.90679033598668 },
} satisfies ToolExample<
  TangentialModeFrequencyInput,
  TangentialModeFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/tangential-mode-frequency",
  title: "Tangential Mode Frequency",
  description:
    "Rectangular-room mode frequency for two nonzero axial mode orders and dimensions.",
  inputs: [
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    { id: "orderX", kind: "integer", label: "Order X", minimum: 1 },
    { id: "orderY", kind: "integer", label: "Order Y", minimum: 1 },
    {
      id: "lengthXMeters",
      kind: "number",
      label: "Length XMeters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "lengthYMeters",
      kind: "number",
      label: "Length YMeters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "modeHertz", kind: "number", label: "Mode Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateTangentialModeFrequency({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      orderX: input.orderX as number,
      orderY: input.orderY as number,
      lengthXMeters: input.lengthXMeters as number,
      lengthYMeters: input.lengthYMeters as number,
    }),
});
export const tangentialModeFrequencyTool = tool;
export const runTangentialModeFrequency = tool.execute;
export default tool;
