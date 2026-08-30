import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MerchantableVolumePercentageInput = Readonly<{
  readonly merchantableCubicMeters: number;
  readonly totalStemCubicMeters: number;
}>;
export type MerchantableVolumePercentageOutput = Readonly<{
  readonly merchantablePercent: number;
}>;

export const calculateMerchantableVolumePercentage = (
  x: MerchantableVolumePercentageInput,
): MerchantableVolumePercentageOutput => {
  if (
    !Number.isFinite(x.merchantableCubicMeters) ||
    x.merchantableCubicMeters < 0
  )
    simpleError(
      "merchantableCubicMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.totalStemCubicMeters) || x.totalStemCubicMeters <= 0)
    simpleError("totalStemCubicMeters", "Provide a finite positive number.");
  if (!(x.merchantableCubicMeters <= x.totalStemCubicMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const merchantablePercent =
    (100 * x.merchantableCubicMeters) / x.totalStemCubicMeters;
  if (!Number.isFinite(merchantablePercent))
    simpleError(
      "merchantablePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    merchantablePercent: Object.is(merchantablePercent, -0)
      ? 0
      : merchantablePercent,
  };
};

export const example = {
  input: {
    merchantableCubicMeters: 8,
    totalStemCubicMeters: 10,
  },
  output: { merchantablePercent: 80 },
} satisfies ToolExample<
  MerchantableVolumePercentageInput,
  MerchantableVolumePercentageOutput
>;

export const tool = createSimpleTool({
  id: "forestry/merchantable-volume-percentage",
  title: "Merchantable Volume Percentage",
  description:
    "Merchantable stem volume as a percentage of total measured stem volume.",
  inputs: [
    {
      id: "merchantableCubicMeters",
      kind: "number",
      label: "Merchantable Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "totalStemCubicMeters",
      kind: "number",
      label: "Total Stem Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "merchantablePercent",
      kind: "number",
      label: "Merchantable Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateMerchantableVolumePercentage({
      merchantableCubicMeters: input.merchantableCubicMeters as number,
      totalStemCubicMeters: input.totalStemCubicMeters as number,
    }),
});
export const merchantableVolumePercentageTool = tool;
export const runMerchantableVolumePercentage = tool.execute;
export default tool;
