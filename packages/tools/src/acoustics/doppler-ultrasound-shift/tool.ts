import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DopplerUltrasoundShiftInput = Readonly<{
  readonly transmitMegahertz: number;
  readonly velocityMetersPerSecond: number;
  readonly beamAngleDegrees: number;
  readonly speedMetersPerSecond: number;
}>;
export type DopplerUltrasoundShiftOutput = Readonly<{
  readonly shiftHertz: number;
}>;

export const calculateDopplerUltrasoundShift = (
  x: DopplerUltrasoundShiftInput,
): DopplerUltrasoundShiftOutput => {
  if (!Number.isFinite(x.transmitMegahertz) || x.transmitMegahertz <= 0)
    simpleError("transmitMegahertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.velocityMetersPerSecond))
    simpleError("velocityMetersPerSecond", "Provide a finite number.");
  if (!Number.isFinite(x.beamAngleDegrees) || x.beamAngleDegrees < 0)
    simpleError("beamAngleDegrees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  if (!(x.beamAngleDegrees <= 180))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shiftHertz =
    (2 *
      x.transmitMegahertz *
      1e6 *
      x.velocityMetersPerSecond *
      Math.cos((x.beamAngleDegrees * Math.PI) / 180)) /
    x.speedMetersPerSecond;
  if (!Number.isFinite(shiftHertz))
    simpleError(
      "shiftHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { shiftHertz: Object.is(shiftHertz, -0) ? 0 : shiftHertz };
};

export const example = {
  input: {
    transmitMegahertz: 2,
    velocityMetersPerSecond: 1,
    beamAngleDegrees: 0,
    speedMetersPerSecond: 1540,
  },
  output: { shiftHertz: 2597.4025974025976 },
} satisfies ToolExample<
  DopplerUltrasoundShiftInput,
  DopplerUltrasoundShiftOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/doppler-ultrasound-shift",
  title: "Doppler Ultrasound Shift",
  description:
    "Signed pulse-echo Doppler shift 2 f0 v cos(theta)/c for tissue velocity at angle theta.",
  inputs: [
    {
      id: "transmitMegahertz",
      kind: "number",
      label: "Transmit Megahertz",
      unit: "MHz",
      minimum: 0,
    },
    {
      id: "velocityMetersPerSecond",
      kind: "number",
      label: "Velocity Meters Per Second",
      unit: "m/s",
    },
    {
      id: "beamAngleDegrees",
      kind: "number",
      label: "Beam Angle Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "shiftHertz", kind: "number", label: "Shift Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateDopplerUltrasoundShift({
      transmitMegahertz: input.transmitMegahertz as number,
      velocityMetersPerSecond: input.velocityMetersPerSecond as number,
      beamAngleDegrees: input.beamAngleDegrees as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const dopplerUltrasoundShiftTool = tool;
export const runDopplerUltrasoundShift = tool.execute;
export default tool;
