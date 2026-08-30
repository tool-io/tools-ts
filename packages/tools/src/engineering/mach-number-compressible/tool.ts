import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MachNumberCompressibleInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly soundSpeedMetersPerSecond: number;
}>;
export type MachNumberCompressibleOutput = Readonly<{
  readonly machNumber: number;
}>;

export const calculateMachNumberCompressible = (
  x: MachNumberCompressibleInput,
): MachNumberCompressibleOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond < 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite number at least 0.",
    );
  const machNumber = x.speedMetersPerSecond / x.soundSpeedMetersPerSecond;
  if (!Number.isFinite(machNumber))
    simpleError(
      "machNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { machNumber: Object.is(machNumber, -0) ? 0 : machNumber };
};

export const example = {
  input: { speedMetersPerSecond: 340, soundSpeedMetersPerSecond: 340 },
  output: { machNumber: 1 },
} satisfies ToolExample<
  MachNumberCompressibleInput,
  MachNumberCompressibleOutput
>;

export const tool = createSimpleTool({
  id: "engineering/mach-number-compressible",
  title: "Mach Number Compressible",
  description:
    "Mach number as flow speed divided by local speed of sound; no constant-speed-of-sound approximation.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [{ id: "machNumber", kind: "number", label: "Mach Number" }],
  calculate: (input) =>
    calculateMachNumberCompressible({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
    }),
});
export const machNumberCompressibleTool = tool;
export const runMachNumberCompressible = tool.execute;
export default tool;
