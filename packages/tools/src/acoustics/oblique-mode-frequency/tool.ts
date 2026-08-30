import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ObliqueModeFrequencyInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly orderX: number;
  readonly orderY: number;
  readonly orderZ: number;
  readonly lengthXMeters: number;
  readonly lengthYMeters: number;
  readonly lengthZMeters: number;
}>;
export type ObliqueModeFrequencyOutput = Readonly<{
  readonly modeHertz: number;
}>;

export const calculateObliqueModeFrequency = (
  x: ObliqueModeFrequencyInput,
): ObliqueModeFrequencyOutput => {
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
  if (
    !Number.isFinite(x.orderZ) ||
    !Number.isSafeInteger(x.orderZ) ||
    x.orderZ < 1
  )
    simpleError("orderZ", "Provide a positive safe integer.");
  if (!Number.isFinite(x.lengthXMeters) || x.lengthXMeters <= 0)
    simpleError("lengthXMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.lengthYMeters) || x.lengthYMeters <= 0)
    simpleError("lengthYMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.lengthZMeters) || x.lengthZMeters <= 0)
    simpleError("lengthZMeters", "Provide a finite positive number.");
  const modeHertz =
    (x.soundSpeedMetersPerSecond / 2) *
    Math.hypot(
      x.orderX / x.lengthXMeters,
      x.orderY / x.lengthYMeters,
      x.orderZ / x.lengthZMeters,
    );
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
    orderZ: 1,
    lengthXMeters: 5,
    lengthYMeters: 4,
    lengthZMeters: 3,
  },
  output: { modeHertz: 79.26401076641137 },
} satisfies ToolExample<ObliqueModeFrequencyInput, ObliqueModeFrequencyOutput>;

export const tool = createSimpleTool({
  id: "acoustics/oblique-mode-frequency",
  title: "Oblique Mode Frequency",
  description:
    "Rectangular-room mode frequency for three nonzero axial orders and dimensions.",
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
    { id: "orderZ", kind: "integer", label: "Order Z", minimum: 1 },
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
    {
      id: "lengthZMeters",
      kind: "number",
      label: "Length ZMeters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "modeHertz", kind: "number", label: "Mode Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateObliqueModeFrequency({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      orderX: input.orderX as number,
      orderY: input.orderY as number,
      orderZ: input.orderZ as number,
      lengthXMeters: input.lengthXMeters as number,
      lengthYMeters: input.lengthYMeters as number,
      lengthZMeters: input.lengthZMeters as number,
    }),
});
export const obliqueModeFrequencyTool = tool;
export const runObliqueModeFrequency = tool.execute;
export default tool;
