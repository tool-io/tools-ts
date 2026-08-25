import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OtifOnTimeInFullPercentInput = {
  readonly ordersDelivered: number;
  readonly ordersOnTimeInFull: number;
};

export type OtifOnTimeInFullPercentOutput = {
  readonly otifPercent: number;
};

export const calculateOtifOnTimeInFullPercent = (
  input: OtifOnTimeInFullPercentInput,
): OtifOnTimeInFullPercentOutput => {
  if (!(
    Number.isSafeInteger(input.ordersDelivered) && input.ordersDelivered > 0
  ))
    return simpleError(
      "ordersDelivered",
      "Orders delivered must be greater than zero.",
      "invalid_orders",
    );
  if (!(
    Number.isSafeInteger(input.ordersOnTimeInFull) &&
    input.ordersOnTimeInFull >= 0 &&
    input.ordersOnTimeInFull <= input.ordersDelivered
  ))
    return simpleError(
      "ordersOnTimeInFull",
      "OTIF orders must be a whole number between zero and delivered orders.",
      "invalid_orders",
    );
  return {
    otifPercent: (input.ordersOnTimeInFull / input.ordersDelivered) * 100,
  };
};

export const otifOnTimeInFullPercentExample = {
  input: { ordersDelivered: 900, ordersOnTimeInFull: 855 },
  output: { otifPercent: 95 },
} satisfies ToolExample<
  OtifOnTimeInFullPercentInput,
  OtifOnTimeInFullPercentOutput
>;

export const otifOnTimeInFullPercentTool = createSimpleTool({
  id: "logistics/otif-on-time-in-full-percent",
  title: "OTIF On Time In Full Percent Calculator",
  description:
    "Compute on-time in-full service level as orders delivered both complete and on time over total orders delivered.",
  inputs: [
    {
      description: "Orders delivered on time and complete.",
      id: "ordersOnTimeInFull",
      kind: "integer",
      label: "OTIF orders",
      minimum: 0,
    },
    {
      description: "Total orders delivered in the period.",
      id: "ordersDelivered",
      kind: "integer",
      label: "Orders delivered",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "On-time in-full percent of delivered orders.",
      id: "otifPercent",
      kind: "number",
      label: "OTIF %",
    },
  ],
  calculate: (input) =>
    calculateOtifOnTimeInFullPercent({
      ordersDelivered: input.ordersDelivered as number,
      ordersOnTimeInFull: input.ordersOnTimeInFull as number,
    }),
});

export const runOtifOnTimeInFullPercent = otifOnTimeInFullPercentTool.execute;
export default otifOnTimeInFullPercentTool;
