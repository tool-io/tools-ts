import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DimesPerOunceSilverYieldInput = Readonly<{
  readonly fineSilverGramsPerDime: number;
}>;
export type DimesPerOunceSilverYieldOutput = Readonly<{
  readonly dimesPerTroyOunce: number;
}>;

export const calculateDimesPerOunceSilverYield = (
  x: DimesPerOunceSilverYieldInput,
): DimesPerOunceSilverYieldOutput => {
  if (
    !Number.isFinite(x.fineSilverGramsPerDime) ||
    x.fineSilverGramsPerDime <= 0
  )
    simpleError("fineSilverGramsPerDime", "Provide a finite positive number.");
  const dimesPerTroyOunce = 31.1034768 / x.fineSilverGramsPerDime;
  if (!Number.isFinite(dimesPerTroyOunce))
    simpleError(
      "dimesPerTroyOunce",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dimesPerTroyOunce: Object.is(dimesPerTroyOunce, -0) ? 0 : dimesPerTroyOunce,
  };
};

export const example = {
  input: {
    fineSilverGramsPerDime: 2.25,
  },
  output: { dimesPerTroyOunce: 13.823767466666666 },
} satisfies ToolExample<
  DimesPerOunceSilverYieldInput,
  DimesPerOunceSilverYieldOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/dimes-per-ounce-silver-yield",
  title: "Dimes Per Ounce Silver Yield",
  description:
    "Find the theoretical, possibly fractional number of dimes per troy ounce of contained silver from their actual fine silver mass; round up for whole coins.",
  inputs: [
    {
      id: "fineSilverGramsPerDime",
      kind: "number",
      label: "Fine Silver Grams Per Dime",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "dimesPerTroyOunce",
      kind: "number",
      label: "Dimes Per Troy Ounce",
      unit: "coins/oz t",
    },
  ],
  calculate: (input) =>
    calculateDimesPerOunceSilverYield({
      fineSilverGramsPerDime: input.fineSilverGramsPerDime as number,
    }),
});
export const runDimesPerOunceSilverYield = tool.execute;
export default tool;
