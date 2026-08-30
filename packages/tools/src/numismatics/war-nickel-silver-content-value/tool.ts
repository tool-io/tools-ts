import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WarNickelSilverContentValueInput = Readonly<{
  readonly coinCount: number;
  readonly silverPricePerTroyOunce: number;
}>;
export type WarNickelSilverContentValueOutput = Readonly<{
  readonly silverContentValue: number;
}>;

export const calculateWarNickelSilverContentValue = (
  x: WarNickelSilverContentValueInput,
): WarNickelSilverContentValueOutput => {
  if (
    !Number.isFinite(x.coinCount) ||
    x.coinCount < 0 ||
    !Number.isSafeInteger(x.coinCount)
  )
    simpleError("coinCount", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.silverPricePerTroyOunce) ||
    x.silverPricePerTroyOunce < 0
  )
    simpleError(
      "silverPricePerTroyOunce",
      "Provide a finite nonnegative number.",
    );
  const silverContentValue =
    ((x.coinCount * 5 * 0.35) / 31.1034768) * x.silverPricePerTroyOunce;
  if (!Number.isFinite(silverContentValue))
    simpleError(
      "silverContentValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    silverContentValue: Object.is(silverContentValue, -0)
      ? 0
      : silverContentValue,
  };
};

export const example = {
  input: {
    coinCount: 20,
    silverPricePerTroyOunce: 30,
  },
  output: { silverContentValue: 33.75828389705938 },
} satisfies ToolExample<
  WarNickelSilverContentValueInput,
  WarNickelSilverContentValueOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/war-nickel-silver-content-value",
  title: "War Nickel Silver Content Value",
  description:
    "Estimate silver content value for verified 5 g, 35%-silver US wartime nickels. Some 1942 nickels are non-silver; verify the issue before using this result.",
  inputs: [
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
    {
      id: "silverPricePerTroyOunce",
      kind: "number",
      label: "Silver Price Per Troy Ounce",
      unit: "currency/oz t",
    },
  ],
  outputs: [
    {
      id: "silverContentValue",
      kind: "number",
      label: "Silver Content Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateWarNickelSilverContentValue({
      coinCount: input.coinCount as number,
      silverPricePerTroyOunce: input.silverPricePerTroyOunce as number,
    }),
});
export const runWarNickelSilverContentValue = tool.execute;
export default tool;
