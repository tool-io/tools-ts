import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MachAngleShockWaveInput = Readonly<{
  readonly machNumber: number;
}>;
export type MachAngleShockWaveOutput = Readonly<{
  readonly angleDegrees: number;
}>;

export const calculateMachAngleShockWave = (
  x: MachAngleShockWaveInput,
): MachAngleShockWaveOutput => {
  if (!Number.isFinite(x.machNumber) || x.machNumber <= 0)
    simpleError("machNumber", "Provide a finite positive number.");
  if (!(x.machNumber >= 1))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const angleDegrees = (Math.asin(1 / x.machNumber) * 180) / Math.PI;
  if (!Number.isFinite(angleDegrees))
    simpleError(
      "angleDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { angleDegrees: Object.is(angleDegrees, -0) ? 0 : angleDegrees };
};

export const example = {
  input: {
    machNumber: 2,
  },
  output: { angleDegrees: 30.000000000000004 },
} satisfies ToolExample<MachAngleShockWaveInput, MachAngleShockWaveOutput>;

export const tool = createSimpleTool({
  id: "acoustics/mach-angle-shock-wave",
  title: "Mach Angle Shock Wave",
  description: "Mach angle in degrees asin(1/M) for supersonic Mach number.",
  inputs: [
    { id: "machNumber", kind: "number", label: "Mach Number", minimum: 0 },
  ],
  outputs: [
    { id: "angleDegrees", kind: "number", label: "Angle Degrees", unit: "deg" },
  ],
  calculate: (input) =>
    calculateMachAngleShockWave({
      machNumber: input.machNumber as number,
    }),
});
export const machAngleShockWaveTool = tool;
export const runMachAngleShockWave = tool.execute;
export default tool;
