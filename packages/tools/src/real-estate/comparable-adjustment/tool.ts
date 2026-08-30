import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComparableAdjustmentInput = Readonly<{
  readonly comparableSalePrice: number;
  readonly signedAdjustment: number;
}>;
export type ComparableAdjustmentOutput = Readonly<{
  readonly adjustedPrice: number;
}>;

export const calculateComparableAdjustment = (
  x: ComparableAdjustmentInput,
): ComparableAdjustmentOutput => {
  if (!Number.isFinite(x.comparableSalePrice) || x.comparableSalePrice < 0)
    simpleError("comparableSalePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.signedAdjustment))
    simpleError("signedAdjustment", "Provide a finite number.");
  if (!(x.comparableSalePrice + x.signedAdjustment >= 0))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const adjustedPrice = x.comparableSalePrice + x.signedAdjustment;
  if (!Number.isFinite(adjustedPrice))
    simpleError(
      "adjustedPrice",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { adjustedPrice: Object.is(adjustedPrice, -0) ? 0 : adjustedPrice };
};

export const example = {
  input: {
    comparableSalePrice: 200000,
    signedAdjustment: -10000,
  },
  output: { adjustedPrice: 190000 },
} satisfies ToolExample<ComparableAdjustmentInput, ComparableAdjustmentOutput>;

export const tool = createSimpleTool({
  id: "real-estate/comparable-adjustment",
  title: "Comparable Adjustment",
  description:
    "Adjusted comparable sale price after a signed total adjustment for differences from the subject.",
  inputs: [
    {
      id: "comparableSalePrice",
      kind: "number",
      label: "Comparable Sale Price",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "signedAdjustment",
      kind: "number",
      label: "Signed Adjustment",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "adjustedPrice",
      kind: "number",
      label: "Adjusted Price",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateComparableAdjustment({
      comparableSalePrice: input.comparableSalePrice as number,
      signedAdjustment: input.signedAdjustment as number,
    }),
});
export const comparableAdjustmentTool = tool;
export const runComparableAdjustment = tool.execute;
export default tool;
