import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuartersPerOunceSilverYieldInput = Readonly<{
  readonly fineSilverGramsPerQuarter: number;
}>;
export type QuartersPerOunceSilverYieldOutput = Readonly<{
  readonly quartersPerTroyOunce: number;
}>;

export const calculateQuartersPerOunceSilverYield = (
  x: QuartersPerOunceSilverYieldInput,
): QuartersPerOunceSilverYieldOutput => {
  if (
    !Number.isFinite(x.fineSilverGramsPerQuarter) ||
    x.fineSilverGramsPerQuarter <= 0
  )
    simpleError(
      "fineSilverGramsPerQuarter",
      "Provide a finite positive number.",
    );
  const quartersPerTroyOunce = 31.1034768 / x.fineSilverGramsPerQuarter;
  if (!Number.isFinite(quartersPerTroyOunce))
    simpleError(
      "quartersPerTroyOunce",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    quartersPerTroyOunce: Object.is(quartersPerTroyOunce, -0)
      ? 0
      : quartersPerTroyOunce,
  };
};

export const example = {
  input: {
    fineSilverGramsPerQuarter: 5.625,
  },
  output: { quartersPerTroyOunce: 5.529506986666666 },
} satisfies ToolExample<
  QuartersPerOunceSilverYieldInput,
  QuartersPerOunceSilverYieldOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/quarters-per-ounce-silver-yield",
  title: "Quarters Per Ounce Silver Yield",
  description:
    "Find the theoretical, possibly fractional number of quarters per troy ounce of silver using issue-specific fine mass; round up for whole coins.",
  inputs: [
    {
      id: "fineSilverGramsPerQuarter",
      kind: "number",
      label: "Fine Silver Grams Per Quarter",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "quartersPerTroyOunce",
      kind: "number",
      label: "Quarters Per Troy Ounce",
      unit: "coins/oz t",
    },
  ],
  calculate: (input) =>
    calculateQuartersPerOunceSilverYield({
      fineSilverGramsPerQuarter: input.fineSilverGramsPerQuarter as number,
    }),
});
export const runQuartersPerOunceSilverYield = tool.execute;
export default tool;
