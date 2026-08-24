import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FillRateLineItemPercentInput = {
  readonly lineItemsOrdered: number;
  readonly lineItemsShippedInFull: number;
};

export type FillRateLineItemPercentOutput = {
  readonly fillRatePercent: number;
};

export const calculateFillRateLineItemPercent = (
  input: FillRateLineItemPercentInput,
): FillRateLineItemPercentOutput => {
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
    !Number.isSafeInteger(input.lineItemsShippedInFull) ||
    input.lineItemsShippedInFull < 0 ||
    input.lineItemsShippedInFull > input.lineItemsOrdered
  )
    return simpleError(
      "lineItemsShippedInFull",
      "Line items shipped in full must be a non-negative safe integer no greater than line items ordered.",
      "invalid_filled_lines",
    );
  return {
    fillRatePercent:
      (input.lineItemsShippedInFull / input.lineItemsOrdered) * 100,
  };
};

export const fillRateLineItemPercentExample = {
  input: { lineItemsOrdered: 5000, lineItemsShippedInFull: 4800 },
  output: { fillRatePercent: 96 },
} satisfies ToolExample<
  FillRateLineItemPercentInput,
  FillRateLineItemPercentOutput
>;

export const fillRateLineItemPercentTool = createSimpleTool({
  id: "logistics/fill-rate-line-item-percent",
  title: "Fill Rate Line Item Percent Calculator",
  description:
    "Compute the order fill rate as complete line items shipped over line items ordered.",
  inputs: [
    {
      description: "Line items shipped complete and on the first shipment.",
      id: "lineItemsShippedInFull",
      kind: "integer",
      label: "Lines filled",
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
      description: "Line-item fill rate percent.",
      id: "fillRatePercent",
      kind: "number",
      label: "Fill rate",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFillRateLineItemPercent({
      lineItemsOrdered: input.lineItemsOrdered as number,
      lineItemsShippedInFull: input.lineItemsShippedInFull as number,
    }),
});

export const runFillRateLineItemPercent = fillRateLineItemPercentTool.execute;
export default fillRateLineItemPercentTool;
