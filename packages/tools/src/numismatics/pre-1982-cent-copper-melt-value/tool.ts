import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Pre1982CentCopperMeltValueInput = Readonly<{
  readonly coinCount: number;
  readonly copperPricePerKilogram: number;
}>;
export type Pre1982CentCopperMeltValueOutput = Readonly<{
  readonly copperMeltValue: number;
}>;

export const calculatePre1982CentCopperMeltValue = (
  x: Pre1982CentCopperMeltValueInput,
): Pre1982CentCopperMeltValueOutput => {
  if (
    !Number.isFinite(x.coinCount) ||
    x.coinCount < 0 ||
    !Number.isSafeInteger(x.coinCount)
  )
    simpleError("coinCount", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.copperPricePerKilogram) ||
    x.copperPricePerKilogram < 0
  )
    simpleError(
      "copperPricePerKilogram",
      "Provide a finite nonnegative number.",
    );
  const copperMeltValue =
    ((x.coinCount * 3.11 * 0.95) / 1000) * x.copperPricePerKilogram;
  if (!Number.isFinite(copperMeltValue))
    simpleError(
      "copperMeltValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    copperMeltValue: Object.is(copperMeltValue, -0) ? 0 : copperMeltValue,
  };
};

export const example = {
  input: {
    coinCount: 100,
    copperPricePerKilogram: 10,
  },
  output: { copperMeltValue: 2.9545 },
} satisfies ToolExample<
  Pre1982CentCopperMeltValueInput,
  Pre1982CentCopperMeltValueOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/pre-1982-cent-copper-melt-value",
  title: "Pre 1982 Cent Copper Melt Value",
  description:
    "Estimate contained copper value only for verified 3.11 g, 95%-copper US cents. The common 1943 steel cent and 1982 composition transition are not covered.",
  inputs: [
    { id: "coinCount", kind: "number", label: "Coin Count", unit: "coins" },
    {
      id: "copperPricePerKilogram",
      kind: "number",
      label: "Copper Price Per Kilogram",
      unit: "currency/kg",
    },
  ],
  outputs: [
    {
      id: "copperMeltValue",
      kind: "number",
      label: "Copper Melt Value",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculatePre1982CentCopperMeltValue({
      coinCount: input.coinCount as number,
      copperPricePerKilogram: input.copperPricePerKilogram as number,
    }),
});
export const runPre1982CentCopperMeltValue = tool.execute;
export default tool;
