import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BagFaceSilverDollarCountInput = Readonly<{
  readonly bagFaceValueDollars: number;
  readonly coinFaceValueDollars: number;
}>;
export type BagFaceSilverDollarCountOutput = Readonly<{
  readonly coinCount: number;
}>;

export const calculateBagFaceSilverDollarCount = (
  x: BagFaceSilverDollarCountInput,
): BagFaceSilverDollarCountOutput => {
  if (!Number.isFinite(x.bagFaceValueDollars) || x.bagFaceValueDollars < 0)
    simpleError("bagFaceValueDollars", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.coinFaceValueDollars) || x.coinFaceValueDollars <= 0)
    simpleError("coinFaceValueDollars", "Provide a finite positive number.");
  const coinCount = x.bagFaceValueDollars / x.coinFaceValueDollars;
  if (!Number.isFinite(coinCount))
    simpleError(
      "coinCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { coinCount: Object.is(coinCount, -0) ? 0 : coinCount };
};

export const example = {
  input: {
    bagFaceValueDollars: 1000,
    coinFaceValueDollars: 1,
  },
  output: { coinCount: 1000 },
} satisfies ToolExample<
  BagFaceSilverDollarCountInput,
  BagFaceSilverDollarCountOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/bag-face-silver-dollar-count",
  title: "Bag Face Silver Dollar Count",
  description:
    "Calculate nominal coin count from a bag's face value and each coin's denomination; verify mixed bags separately.",
  inputs: [
    {
      id: "bagFaceValueDollars",
      kind: "number",
      label: "Bag Face Value Dollars",
      unit: "currency",
    },
    {
      id: "coinFaceValueDollars",
      kind: "number",
      label: "Coin Face Value Dollars",
      unit: "currency/coin",
    },
  ],
  outputs: [
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
  ],
  calculate: (input) =>
    calculateBagFaceSilverDollarCount({
      bagFaceValueDollars: input.bagFaceValueDollars as number,
      coinFaceValueDollars: input.coinFaceValueDollars as number,
    }),
});
export const runBagFaceSilverDollarCount = tool.execute;
export default tool;
