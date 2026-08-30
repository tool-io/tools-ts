import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelativeDensityInput = Readonly<{
  readonly treesPerHectare: number;
  readonly referenceTreesPerHectare: number;
}>;
export type RelativeDensityOutput = Readonly<{
  readonly relativeDensityPercent: number;
}>;

export const calculateRelativeDensity = (
  x: RelativeDensityInput,
): RelativeDensityOutput => {
  if (!Number.isFinite(x.treesPerHectare) || x.treesPerHectare < 0)
    simpleError("treesPerHectare", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.referenceTreesPerHectare) ||
    x.referenceTreesPerHectare <= 0
  )
    simpleError(
      "referenceTreesPerHectare",
      "Provide a finite positive number.",
    );
  const relativeDensityPercent =
    (100 * x.treesPerHectare) / x.referenceTreesPerHectare;
  if (!Number.isFinite(relativeDensityPercent))
    simpleError(
      "relativeDensityPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    relativeDensityPercent: Object.is(relativeDensityPercent, -0)
      ? 0
      : relativeDensityPercent,
  };
};

export const example = {
  input: {
    treesPerHectare: 500,
    referenceTreesPerHectare: 1000,
  },
  output: { relativeDensityPercent: 50 },
} satisfies ToolExample<RelativeDensityInput, RelativeDensityOutput>;

export const tool = createSimpleTool({
  id: "forestry/relative-density",
  title: "Relative Density",
  description:
    "Observed stems per hectare as a percentage of a supplied reference stand density.",
  inputs: [
    {
      id: "treesPerHectare",
      kind: "number",
      label: "Trees Per Hectare",
      unit: "1/ha",
      minimum: 0,
    },
    {
      id: "referenceTreesPerHectare",
      kind: "number",
      label: "Reference Trees Per Hectare",
      unit: "1/ha",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "relativeDensityPercent",
      kind: "number",
      label: "Relative Density Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateRelativeDensity({
      treesPerHectare: input.treesPerHectare as number,
      referenceTreesPerHectare: input.referenceTreesPerHectare as number,
    }),
});
export const relativeDensityTool = tool;
export const runRelativeDensity = tool.execute;
export default tool;
