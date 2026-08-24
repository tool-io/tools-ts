import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BackorderRatePercentInput = {
  readonly lineItemsBackordered: number;
  readonly lineItemsOrdered: number;
};

export type BackorderRatePercentOutput = {
  readonly backorderRatePercent: number;
};

export const calculateBackorderRatePercent = (
  input: BackorderRatePercentInput,
): BackorderRatePercentOutput => {
  if (
    !Number.isSafeInteger(input.lineItemsOrdered) ||
    input.lineItemsOrdered <= 0
  )
    return simpleError(
      "lineItemsOrdered",
      "Line items ordered must be a positive safe integer.",
      "invalid_lines",
    );
  if (
    !Number.isSafeInteger(input.lineItemsBackordered) ||
    input.lineItemsBackordered < 0 ||
    input.lineItemsBackordered > input.lineItemsOrdered
  )
    return simpleError(
      "lineItemsBackordered",
      "Backordered line items must be a non-negative safe integer no greater than total ordered line items.",
      "invalid_backorders",
    );
  return {
    backorderRatePercent:
      (input.lineItemsBackordered / input.lineItemsOrdered) * 100,
  };
};

export const backorderRatePercentExample = {
  input: { lineItemsBackordered: 130, lineItemsOrdered: 5200 },
  output: { backorderRatePercent: 2.5 },
} satisfies ToolExample<BackorderRatePercentInput, BackorderRatePercentOutput>;

export const backorderRatePercentTool = createSimpleTool({
  id: "logistics/backorder-rate-percent",
  title: "Backorder Rate Percent Calculator",
  description:
    "Compute the backorder rate as backordered line items over total ordered line items.",
  inputs: [
    {
      description:
        "Line items placed on backorder; cannot exceed total ordered lines.",
      id: "lineItemsBackordered",
      kind: "integer",
      label: "Lines backordered",
      minimum: 0,
    },
    {
      description: "Total line items ordered in the same period.",
      id: "lineItemsOrdered",
      kind: "integer",
      label: "Lines ordered",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Backordered lines as a percentage of lines ordered, from 0 to 100.",
      id: "backorderRatePercent",
      kind: "number",
      label: "Backorder %",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBackorderRatePercent({
      lineItemsBackordered: input.lineItemsBackordered as number,
      lineItemsOrdered: input.lineItemsOrdered as number,
    }),
});

export const runBackorderRatePercent = backorderRatePercentTool.execute;
export default backorderRatePercentTool;
