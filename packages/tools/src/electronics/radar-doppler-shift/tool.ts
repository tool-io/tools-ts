import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadarDopplerShiftInput = Readonly<{
  readonly radialSpeedMetersPerSecond: number;
  readonly carrierHertz: number;
}>;
export type RadarDopplerShiftOutput = Readonly<{
  readonly dopplerHertz: number;
}>;

export const calculateRadarDopplerShift = (
  x: RadarDopplerShiftInput,
): RadarDopplerShiftOutput => {
  if (!Number.isFinite(x.radialSpeedMetersPerSecond))
    simpleError("radialSpeedMetersPerSecond", "Provide a finite number.");
  if (!Number.isFinite(x.carrierHertz) || x.carrierHertz < 0)
    simpleError("carrierHertz", "Provide a finite number at least 0.");
  const dopplerHertz =
    (2 * x.radialSpeedMetersPerSecond * x.carrierHertz) / 299792458;
  if (!Number.isFinite(dopplerHertz))
    simpleError(
      "dopplerHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { dopplerHertz: Object.is(dopplerHertz, -0) ? 0 : dopplerHertz };
};

export const example = {
  input: { radialSpeedMetersPerSecond: 30, carrierHertz: 10000000000 },
  output: { dopplerHertz: 2001.3845711889123 },
} satisfies ToolExample<RadarDopplerShiftInput, RadarDopplerShiftOutput>;

export const tool = createSimpleTool({
  id: "electronics/radar-doppler-shift",
  title: "Radar Doppler Shift",
  description:
    "Monostatic radar Doppler frequency shift for a signed line-of-sight radial speed, with closing defined positive.",
  inputs: [
    {
      id: "radialSpeedMetersPerSecond",
      kind: "number",
      label: "Radial Speed Meters Per Second",
      unit: "m/s",
    },
    {
      id: "carrierHertz",
      kind: "number",
      label: "Carrier Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dopplerHertz", kind: "number", label: "Doppler Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateRadarDopplerShift({
      radialSpeedMetersPerSecond: input.radialSpeedMetersPerSecond as number,
      carrierHertz: input.carrierHertz as number,
    }),
});
export const radarDopplerShiftTool = tool;
export const runRadarDopplerShift = tool.execute;
export default tool;
