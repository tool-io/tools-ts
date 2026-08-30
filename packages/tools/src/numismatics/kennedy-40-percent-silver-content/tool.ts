import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Kennedy40PercentSilverContentInput = Readonly<{
  readonly coinCount: number;
  readonly coinWeightGrams: number;
}>;
export type Kennedy40PercentSilverContentOutput = Readonly<{
  readonly fineSilverGrams: number;
}>;

export const calculateKennedy40PercentSilverContent = (
  x: Kennedy40PercentSilverContentInput,
): Kennedy40PercentSilverContentOutput => {
  if (
    !Number.isFinite(x.coinCount) ||
    x.coinCount < 0 ||
    !Number.isSafeInteger(x.coinCount)
  )
    simpleError("coinCount", "Provide a nonnegative whole number.");
  if (!Number.isFinite(x.coinWeightGrams) || x.coinWeightGrams < 0)
    simpleError("coinWeightGrams", "Provide a finite nonnegative number.");
  const fineSilverGrams = x.coinCount * x.coinWeightGrams * 0.4;
  if (!Number.isFinite(fineSilverGrams))
    simpleError(
      "fineSilverGrams",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fineSilverGrams: Object.is(fineSilverGrams, -0) ? 0 : fineSilverGrams,
  };
};

export const example = {
  input: {
    coinCount: 10,
    coinWeightGrams: 11.5,
  },
  output: { fineSilverGrams: 46 },
} satisfies ToolExample<
  Kennedy40PercentSilverContentInput,
  Kennedy40PercentSilverContentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/kennedy-40-percent-silver-content",
  title: "Kennedy 40 Percent Silver Content",
  description:
    "Calculate contained silver in verified 40%-silver Kennedy half dollars; enter their measured or specified gross weight.",
  inputs: [
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
    {
      id: "coinWeightGrams",
      kind: "number",
      label: "Coin Weight Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "fineSilverGrams",
      kind: "number",
      label: "Fine Silver Grams",
      unit: "g",
    },
  ],
  calculate: (input) =>
    calculateKennedy40PercentSilverContent({
      coinCount: input.coinCount as number,
      coinWeightGrams: input.coinWeightGrams as number,
    }),
});
export const runKennedy40PercentSilverContent = tool.execute;
export default tool;
