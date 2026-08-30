import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulpVolumePercentageInput = Readonly<{
  readonly pulpCubicMeters: number;
  readonly merchantableCubicMeters: number;
}>;
export type PulpVolumePercentageOutput = Readonly<{
  readonly pulpPercent: number;
}>;

export const calculatePulpVolumePercentage = (
  x: PulpVolumePercentageInput,
): PulpVolumePercentageOutput => {
  if (!Number.isFinite(x.pulpCubicMeters) || x.pulpCubicMeters < 0)
    simpleError("pulpCubicMeters", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.merchantableCubicMeters) ||
    x.merchantableCubicMeters <= 0
  )
    simpleError("merchantableCubicMeters", "Provide a finite positive number.");
  if (!(x.pulpCubicMeters <= x.merchantableCubicMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pulpPercent = (100 * x.pulpCubicMeters) / x.merchantableCubicMeters;
  if (!Number.isFinite(pulpPercent))
    simpleError(
      "pulpPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pulpPercent: Object.is(pulpPercent, -0) ? 0 : pulpPercent };
};

export const example = {
  input: {
    pulpCubicMeters: 3,
    merchantableCubicMeters: 8,
  },
  output: { pulpPercent: 37.5 },
} satisfies ToolExample<PulpVolumePercentageInput, PulpVolumePercentageOutput>;

export const tool = createSimpleTool({
  id: "forestry/pulp-volume-percentage",
  title: "Pulp Volume Percentage",
  description: "Pulpwood volume as a percentage of total merchantable volume.",
  inputs: [
    {
      id: "pulpCubicMeters",
      kind: "number",
      label: "Pulp Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "merchantableCubicMeters",
      kind: "number",
      label: "Merchantable Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pulpPercent",
      kind: "number",
      label: "Pulp Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculatePulpVolumePercentage({
      pulpCubicMeters: input.pulpCubicMeters as number,
      merchantableCubicMeters: input.merchantableCubicMeters as number,
    }),
});
export const pulpVolumePercentageTool = tool;
export const runPulpVolumePercentage = tool.execute;
export default tool;
