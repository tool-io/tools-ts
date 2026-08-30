import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive } from "../shared.js";

export type Input = Readonly<{
  readonly oldConversionPrice: number;
  readonly newIssuePrice: number;
  readonly premoneyShares: number;
  readonly newShares: number;
}>;
export type Output = Readonly<{
  readonly fullRatchetPrice: number;
  readonly weightedAveragePrice: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.oldConversionPrice, "oldConversionPrice");
  positive(input.newIssuePrice, "newIssuePrice");
  positive(input.premoneyShares, "premoneyShares");
  nonnegative(input.newShares, "newShares");
  const fullRatchetPrice = Math.min(
      input.oldConversionPrice,
      input.newIssuePrice,
    ),
    weightedAveragePrice =
      input.newIssuePrice >= input.oldConversionPrice
        ? input.oldConversionPrice
        : (input.oldConversionPrice *
            (input.premoneyShares +
              (input.newShares * input.newIssuePrice) /
                input.oldConversionPrice)) /
          (input.premoneyShares + input.newShares);
  return { fullRatchetPrice, weightedAveragePrice };
};
export const exampleInput = {
  oldConversionPrice: 2,
  newIssuePrice: 1,
  premoneyShares: 1000,
  newShares: 1000,
} satisfies Input;
export const exampleOutput = {
  fullRatchetPrice: 1,
  weightedAveragePrice: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/anti-dilution-comparison",
  title: "Anti Dilution Comparison",
  description:
    "Compare full-ratchet and broad-based weighted-average down-round conversion prices.",
  inputs: [
    { id: "oldConversionPrice", label: "Old conversion price", kind: "number" },
    { id: "newIssuePrice", label: "New issue price", kind: "number" },
    { id: "premoneyShares", label: "Premoney shares", kind: "number" },
    { id: "newShares", label: "New shares", kind: "number" },
  ],
  outputs: [
    { id: "fullRatchetPrice", label: "Full ratchet price", kind: "number" },
    {
      id: "weightedAveragePrice",
      label: "Weighted average price",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      oldConversionPrice: value.oldConversionPrice as number,
      newIssuePrice: value.newIssuePrice as number,
      premoneyShares: value.premoneyShares as number,
      newShares: value.newShares as number,
    }),
});
export const run = tool.execute;
export default tool;
