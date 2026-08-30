import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaHalfPowerBeamwidthInput = Readonly<{
  readonly leftDegrees: number;
  readonly rightDegrees: number;
}>;
export type AntennaHalfPowerBeamwidthOutput = Readonly<{
  readonly beamwidthDegrees: number;
}>;

export const calculateAntennaHalfPowerBeamwidth = (
  x: AntennaHalfPowerBeamwidthInput,
): AntennaHalfPowerBeamwidthOutput => {
  if (!Number.isFinite(x.leftDegrees))
    simpleError("leftDegrees", "Provide a finite number.");
  if (!Number.isFinite(x.rightDegrees))
    simpleError("rightDegrees", "Provide a finite number.");
  if (x.rightDegrees <= x.leftDegrees)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const beamwidthDegrees = x.rightDegrees - x.leftDegrees;
  if (!Number.isFinite(beamwidthDegrees))
    simpleError(
      "beamwidthDegrees",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    beamwidthDegrees: Object.is(beamwidthDegrees, -0) ? 0 : beamwidthDegrees,
  };
};

export const example = {
  input: { leftDegrees: -30, rightDegrees: 30 },
  output: { beamwidthDegrees: 60 },
} satisfies ToolExample<
  AntennaHalfPowerBeamwidthInput,
  AntennaHalfPowerBeamwidthOutput
>;

export const tool = createSimpleTool({
  id: "electronics/antenna-half-power-beamwidth",
  title: "Antenna Half Power Beamwidth",
  description:
    "Angular separation of the two −3 dB pattern crossings around one antenna main lobe.",
  inputs: [
    { id: "leftDegrees", kind: "number", label: "Left Degrees", unit: "°" },
    { id: "rightDegrees", kind: "number", label: "Right Degrees", unit: "°" },
  ],
  outputs: [
    {
      id: "beamwidthDegrees",
      kind: "number",
      label: "Beamwidth Degrees",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateAntennaHalfPowerBeamwidth({
      leftDegrees: input.leftDegrees as number,
      rightDegrees: input.rightDegrees as number,
    }),
});
export const antennaHalfPowerBeamwidthTool = tool;
export const runAntennaHalfPowerBeamwidth = tool.execute;
export default tool;
