import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PremiumOverSpotPercentInput = Readonly<{
  readonly askingPrice: number;
  readonly metalValue: number;
}>;
export type PremiumOverSpotPercentOutput = Readonly<{
  readonly premiumPercent: number;
}>;

export const calculatePremiumOverSpotPercent = (
  x: PremiumOverSpotPercentInput,
): PremiumOverSpotPercentOutput => {
  if (!Number.isFinite(x.askingPrice) || x.askingPrice < 0)
    simpleError("askingPrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.metalValue) || x.metalValue <= 0)
    simpleError("metalValue", "Provide a finite positive number.");
  const premiumPercent = ((x.askingPrice - x.metalValue) / x.metalValue) * 100;
  if (!Number.isFinite(premiumPercent))
    simpleError(
      "premiumPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { premiumPercent: Object.is(premiumPercent, -0) ? 0 : premiumPercent };
};

export const example = {
  input: {
    askingPrice: 120,
    metalValue: 100,
  },
  output: { premiumPercent: 20 },
} satisfies ToolExample<
  PremiumOverSpotPercentInput,
  PremiumOverSpotPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/premium-over-spot-percent",
  title: "Premium Over Spot Percent",
  description:
    "Compare a coin's asking price with its metal value; a negative result is a discount.",
  inputs: [
    {
      id: "askingPrice",
      kind: "number",
      label: "Asking Price",
      unit: "currency",
    },
    {
      id: "metalValue",
      kind: "number",
      label: "Metal Value",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "premiumPercent",
      kind: "number",
      label: "Premium Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculatePremiumOverSpotPercent({
      askingPrice: input.askingPrice as number,
      metalValue: input.metalValue as number,
    }),
});
export const runPremiumOverSpotPercent = tool.execute;
export default tool;
