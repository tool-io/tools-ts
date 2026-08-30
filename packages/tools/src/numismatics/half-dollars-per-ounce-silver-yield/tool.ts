import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HalfDollarsPerOunceSilverYieldInput = Readonly<{
  readonly fineSilverGramsPerHalfDollar: number;
}>;
export type HalfDollarsPerOunceSilverYieldOutput = Readonly<{
  readonly halfDollarsPerTroyOunce: number;
}>;

export const calculateHalfDollarsPerOunceSilverYield = (
  x: HalfDollarsPerOunceSilverYieldInput,
): HalfDollarsPerOunceSilverYieldOutput => {
  if (
    !Number.isFinite(x.fineSilverGramsPerHalfDollar) ||
    x.fineSilverGramsPerHalfDollar <= 0
  )
    simpleError(
      "fineSilverGramsPerHalfDollar",
      "Provide a finite positive number.",
    );
  const halfDollarsPerTroyOunce = 31.1034768 / x.fineSilverGramsPerHalfDollar;
  if (!Number.isFinite(halfDollarsPerTroyOunce))
    simpleError(
      "halfDollarsPerTroyOunce",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    halfDollarsPerTroyOunce: Object.is(halfDollarsPerTroyOunce, -0)
      ? 0
      : halfDollarsPerTroyOunce,
  };
};

export const example = {
  input: {
    fineSilverGramsPerHalfDollar: 11.25,
  },
  output: { halfDollarsPerTroyOunce: 2.764753493333333 },
} satisfies ToolExample<
  HalfDollarsPerOunceSilverYieldInput,
  HalfDollarsPerOunceSilverYieldOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/half-dollars-per-ounce-silver-yield",
  title: "Half Dollars Per Ounce Silver Yield",
  description:
    "Find the theoretical, possibly fractional number of half dollars per troy ounce of silver using issue-specific fine mass; round up for whole coins.",
  inputs: [
    {
      id: "fineSilverGramsPerHalfDollar",
      kind: "number",
      label: "Fine Silver Grams Per Half Dollar",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "halfDollarsPerTroyOunce",
      kind: "number",
      label: "Half Dollars Per Troy Ounce",
      unit: "coins/oz t",
    },
  ],
  calculate: (input) =>
    calculateHalfDollarsPerOunceSilverYield({
      fineSilverGramsPerHalfDollar:
        input.fineSilverGramsPerHalfDollar as number,
    }),
});
export const runHalfDollarsPerOunceSilverYield = tool.execute;
export default tool;
