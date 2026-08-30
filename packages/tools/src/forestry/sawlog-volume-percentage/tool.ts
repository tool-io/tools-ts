import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SawlogVolumePercentageInput = Readonly<{
  readonly sawlogCubicMeters: number;
  readonly merchantableCubicMeters: number;
}>;
export type SawlogVolumePercentageOutput = Readonly<{
  readonly sawlogPercent: number;
}>;

export const calculateSawlogVolumePercentage = (
  x: SawlogVolumePercentageInput,
): SawlogVolumePercentageOutput => {
  if (!Number.isFinite(x.sawlogCubicMeters) || x.sawlogCubicMeters < 0)
    simpleError("sawlogCubicMeters", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.merchantableCubicMeters) ||
    x.merchantableCubicMeters <= 0
  )
    simpleError("merchantableCubicMeters", "Provide a finite positive number.");
  if (!(x.sawlogCubicMeters <= x.merchantableCubicMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const sawlogPercent = (100 * x.sawlogCubicMeters) / x.merchantableCubicMeters;
  if (!Number.isFinite(sawlogPercent))
    simpleError(
      "sawlogPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sawlogPercent: Object.is(sawlogPercent, -0) ? 0 : sawlogPercent };
};

export const example = {
  input: {
    sawlogCubicMeters: 5,
    merchantableCubicMeters: 8,
  },
  output: { sawlogPercent: 62.5 },
} satisfies ToolExample<
  SawlogVolumePercentageInput,
  SawlogVolumePercentageOutput
>;

export const tool = createSimpleTool({
  id: "forestry/sawlog-volume-percentage",
  title: "Sawlog Volume Percentage",
  description: "Sawlog volume as a percentage of total merchantable volume.",
  inputs: [
    {
      id: "sawlogCubicMeters",
      kind: "number",
      label: "Sawlog Cubic Meters",
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
      id: "sawlogPercent",
      kind: "number",
      label: "Sawlog Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateSawlogVolumePercentage({
      sawlogCubicMeters: input.sawlogCubicMeters as number,
      merchantableCubicMeters: input.merchantableCubicMeters as number,
    }),
});
export const sawlogVolumePercentageTool = tool;
export const runSawlogVolumePercentage = tool.execute;
export default tool;
