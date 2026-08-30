import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DuplicateSwapValueDifferenceInput = Readonly<{
  readonly receivedCoinValue: number;
  readonly offeredCoinValue: number;
}>;
export type DuplicateSwapValueDifferenceOutput = Readonly<{
  readonly valueDifference: number;
}>;

export const calculateDuplicateSwapValueDifference = (
  x: DuplicateSwapValueDifferenceInput,
): DuplicateSwapValueDifferenceOutput => {
  if (!Number.isFinite(x.receivedCoinValue) || x.receivedCoinValue < 0)
    simpleError("receivedCoinValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.offeredCoinValue) || x.offeredCoinValue < 0)
    simpleError("offeredCoinValue", "Provide a finite nonnegative number.");
  const valueDifference = x.receivedCoinValue - x.offeredCoinValue;
  if (!Number.isFinite(valueDifference))
    simpleError(
      "valueDifference",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    valueDifference: Object.is(valueDifference, -0) ? 0 : valueDifference,
  };
};

export const example = {
  input: {
    receivedCoinValue: 110,
    offeredCoinValue: 100,
  },
  output: { valueDifference: 10 },
} satisfies ToolExample<
  DuplicateSwapValueDifferenceInput,
  DuplicateSwapValueDifferenceOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/duplicate-swap-value-difference",
  title: "Duplicate Swap Value Difference",
  description:
    "Show the nominal value difference when swapping a duplicate coin.",
  inputs: [
    {
      id: "receivedCoinValue",
      kind: "number",
      label: "Received Coin Value",
      unit: "currency",
    },
    {
      id: "offeredCoinValue",
      kind: "number",
      label: "Offered Coin Value",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "valueDifference",
      kind: "number",
      label: "Value Difference",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateDuplicateSwapValueDifference({
      receivedCoinValue: input.receivedCoinValue as number,
      offeredCoinValue: input.offeredCoinValue as number,
    }),
});
export const runDuplicateSwapValueDifference = tool.execute;
export default tool;
