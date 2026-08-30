import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HelmholtzPortLengthInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly neckAreaSquareMeters: number;
  readonly cavityCubicMeters: number;
  readonly targetHertz: number;
  readonly totalEndCorrectionMeters: number;
}>;
export type HelmholtzPortLengthOutput = Readonly<{
  readonly physicalNeckMeters: number;
}>;

export const calculateHelmholtzPortLength = (
  x: HelmholtzPortLengthInput,
): HelmholtzPortLengthOutput => {
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
  if (!Number.isFinite(x.targetHertz) || x.targetHertz <= 0)
    simpleError("targetHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.totalEndCorrectionMeters) ||
    x.totalEndCorrectionMeters < 0
  )
    simpleError(
      "totalEndCorrectionMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !(
      x.neckAreaSquareMeters /
        (x.cavityCubicMeters *
          ((2 * Math.PI * x.targetHertz) / x.soundSpeedMetersPerSecond) ** 2) >=
      x.totalEndCorrectionMeters
    )
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const physicalNeckMeters =
    x.neckAreaSquareMeters /
      (x.cavityCubicMeters *
        ((2 * Math.PI * x.targetHertz) / x.soundSpeedMetersPerSecond) ** 2) -
    x.totalEndCorrectionMeters;
  if (!Number.isFinite(physicalNeckMeters))
    simpleError(
      "physicalNeckMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    physicalNeckMeters: Object.is(physicalNeckMeters, -0)
      ? 0
      : physicalNeckMeters,
  };
};

export const example = {
  input: {
    soundSpeedMetersPerSecond: 343,
    neckAreaSquareMeters: 0.001,
    cavityCubicMeters: 0.01,
    targetHertz: 100,
    totalEndCorrectionMeters: 0.01,
  },
  output: { physicalNeckMeters: 0.019800839835843492 },
} satisfies ToolExample<HelmholtzPortLengthInput, HelmholtzPortLengthOutput>;

export const tool = createSimpleTool({
  id: "acoustics/helmholtz-port-length",
  title: "Helmholtz Port Length",
  description:
    "Physical Helmholtz neck length required for a target resonance, subtracting a supplied total end correction.",
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
      id: "targetHertz",
      kind: "number",
      label: "Target Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "totalEndCorrectionMeters",
      kind: "number",
      label: "Total End Correction Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "physicalNeckMeters",
      kind: "number",
      label: "Physical Neck Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateHelmholtzPortLength({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      neckAreaSquareMeters: input.neckAreaSquareMeters as number,
      cavityCubicMeters: input.cavityCubicMeters as number,
      targetHertz: input.targetHertz as number,
      totalEndCorrectionMeters: input.totalEndCorrectionMeters as number,
    }),
});
export const helmholtzPortLengthTool = tool;
export const runHelmholtzPortLength = tool.execute;
export default tool;
