import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicNmoCorrectionInput = {
  readonly zeroOffsetTimeS: number;
  readonly offsetM: number;
  readonly velocityMPers: number;
};

export type SeismicNmoCorrectionOutput = {
  readonly moveoutTimeS: number;
  readonly nmoCorrectionS: number;
};

export const calculateSeismicNmoCorrection = (
  input: SeismicNmoCorrectionInput,
): SeismicNmoCorrectionOutput => {
  if (!(input.zeroOffsetTimeS > 0))
    return simpleError(
      "zeroOffsetTimeS",
      "Zero-offset time must be greater than zero.",
      "invalid_time",
    );
  if (!(input.offsetM >= 0))
    return simpleError(
      "offsetM",
      "Offset must be non-negative.",
      "invalid_offset",
    );
  if (!(input.velocityMPers > 0))
    return simpleError(
      "velocityMPers",
      "Velocity must be greater than zero.",
      "invalid_velocity",
    );
  const moveoutTimeS = Math.sqrt(
    input.zeroOffsetTimeS ** 2 + (input.offsetM / input.velocityMPers) ** 2,
  );
  return { moveoutTimeS, nmoCorrectionS: moveoutTimeS - input.zeroOffsetTimeS };
};

export const seismicNmoCorrectionExample = {
  input: { zeroOffsetTimeS: 1.0, offsetM: 1000, velocityMPers: 2000 },
  output: {
    moveoutTimeS: 1.118033988749895,
    nmoCorrectionS: 0.1180339887498949,
  },
} satisfies ToolExample<SeismicNmoCorrectionInput, SeismicNmoCorrectionOutput>;

export const seismicNmoCorrectionTool = createSimpleTool({
  id: "geology/seismic-nmo-correction",
  title: "Seismic NMO Correction Calculator",
  description:
    "Normal-moveout hyperbola t(x)^2 = t0^2 + x^2/V^2 for a horizontal reflector, with zero-offset time t0 in seconds, source-receiver offset x in meters and velocity in meters per second.",
  inputs: [
    {
      description: "Zero-offset two-way time in seconds.",
      id: "zeroOffsetTimeS",
      kind: "number",
      label: "t0",
    },
    {
      description: "Source-receiver offset in meters.",
      id: "offsetM",
      kind: "number",
      label: "x",
      minimum: 0,
    },
    {
      description: "Moveout (RMS/stack) velocity in meters per second.",
      id: "velocityMPers",
      kind: "number",
      label: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Reflected arrival time at the given offset in seconds.",
      id: "moveoutTimeS",
      kind: "number",
      label: "t(x)",
    },
    {
      description: "Normal-moveout correction t(x) - t0 in seconds.",
      id: "nmoCorrectionS",
      kind: "number",
      label: "NMO",
    },
  ],
  calculate: (input) =>
    calculateSeismicNmoCorrection(
      input as unknown as SeismicNmoCorrectionInput,
    ),
});

export const runSeismicNmoCorrection = seismicNmoCorrectionTool.execute;
export default seismicNmoCorrectionTool;
