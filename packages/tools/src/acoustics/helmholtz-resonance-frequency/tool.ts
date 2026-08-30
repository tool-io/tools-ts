import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HelmholtzResonanceFrequencyInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly neckAreaSquareMeters: number;
  readonly cavityCubicMeters: number;
  readonly effectiveNeckMeters: number;
}>;
export type HelmholtzResonanceFrequencyOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateHelmholtzResonanceFrequency = (
  x: HelmholtzResonanceFrequencyInput,
): HelmholtzResonanceFrequencyOutput => {
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  if (!Number.isFinite(x.neckAreaSquareMeters) || x.neckAreaSquareMeters <= 0)
    simpleError("neckAreaSquareMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.cavityCubicMeters) || x.cavityCubicMeters <= 0)
    simpleError("cavityCubicMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.effectiveNeckMeters) || x.effectiveNeckMeters <= 0)
    simpleError("effectiveNeckMeters", "Provide a finite positive number.");
  const frequencyHertz =
    (x.soundSpeedMetersPerSecond / (2 * Math.PI)) *
    Math.sqrt(
      x.neckAreaSquareMeters / (x.cavityCubicMeters * x.effectiveNeckMeters),
    );
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: {
    soundSpeedMetersPerSecond: 343,
    neckAreaSquareMeters: 0.001,
    cavityCubicMeters: 0.01,
    effectiveNeckMeters: 0.1,
  },
  output: { frequencyHertz: 54.5901454805201 },
} satisfies ToolExample<
  HelmholtzResonanceFrequencyInput,
  HelmholtzResonanceFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/helmholtz-resonance-frequency",
  title: "Helmholtz Resonance Frequency",
  description:
    "Lumped Helmholtz resonator frequency from sound speed, neck area, cavity volume and effective neck length.",
  inputs: [
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "neckAreaSquareMeters",
      kind: "number",
      label: "Neck Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "cavityCubicMeters",
      kind: "number",
      label: "Cavity Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "effectiveNeckMeters",
      kind: "number",
      label: "Effective Neck Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateHelmholtzResonanceFrequency({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      neckAreaSquareMeters: input.neckAreaSquareMeters as number,
      cavityCubicMeters: input.cavityCubicMeters as number,
      effectiveNeckMeters: input.effectiveNeckMeters as number,
    }),
});
export const helmholtzResonanceFrequencyTool = tool;
export const runHelmholtzResonanceFrequency = tool.execute;
export default tool;
