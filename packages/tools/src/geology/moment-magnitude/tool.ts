import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MomentMagnitudeInput = {
  readonly seismicMomentNewtonMeters: number;
};

export type MomentMagnitudeOutput = {
  readonly momentMagnitude: number;
};

export const calculateMomentMagnitude = (
  input: MomentMagnitudeInput,
): MomentMagnitudeOutput => {
  if (!(input.seismicMomentNewtonMeters > 0))
    simpleError(
      "seismicMomentNewtonMeters",
      "Seismic moment must be greater than zero.",
      "invalid_moment",
    );
  return {
    momentMagnitude:
      (2 / 3) * (Math.log10(input.seismicMomentNewtonMeters) - 9.1),
  };
};

export const momentMagnitudeExample = {
  input: { seismicMomentNewtonMeters: 15000000000000000000 },
  output: { momentMagnitude: 6.717394172703788 },
} satisfies ToolExample<MomentMagnitudeInput, MomentMagnitudeOutput>;

export const momentMagnitudeTool = createSimpleTool({
  id: "geology/moment-magnitude",
  title: "Moment Magnitude Calculator",
  description:
    "Hanks-Kanamori moment magnitude Mw = (2/3)(log10 M0 - 9.1) with seismic moment M0 in newton meters.",
  inputs: [
    {
      description: "Seismic moment in newton meters.",
      id: "seismicMomentNewtonMeters",
      kind: "number",
      label: "Seismic moment",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Moment magnitude Mw (dimensionless).",
      id: "momentMagnitude",
      kind: "number",
      label: "Mw",
    },
  ],
  calculate: (input) =>
    calculateMomentMagnitude(input as unknown as MomentMagnitudeInput),
});

export const runMomentMagnitude = momentMagnitudeTool.execute;
export default momentMagnitudeTool;
