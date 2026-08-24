import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FirstAttemptDeliverySuccessPercentInput = {
  readonly firstAttemptDeliveries: number;
  readonly totalDeliveryStops: number;
};

export type FirstAttemptDeliverySuccessPercentOutput = {
  readonly firstAttemptSuccessPercent: number;
};

export const calculateFirstAttemptDeliverySuccessPercent = (
  input: FirstAttemptDeliverySuccessPercentInput,
): FirstAttemptDeliverySuccessPercentOutput => {
  if (
    !Number.isSafeInteger(input.totalDeliveryStops) ||
    input.totalDeliveryStops <= 0
  )
    return simpleError(
      "totalDeliveryStops",
      "Total delivery stops must be a positive safe integer.",
      "invalid_stops",
    );
  if (
    !Number.isSafeInteger(input.firstAttemptDeliveries) ||
    input.firstAttemptDeliveries < 0 ||
    input.firstAttemptDeliveries > input.totalDeliveryStops
  )
    return simpleError(
      "firstAttemptDeliveries",
      "First-attempt deliveries must be a non-negative safe integer no greater than total delivery stops.",
      "invalid_first_attempt_deliveries",
    );
  return {
    firstAttemptSuccessPercent:
      (input.firstAttemptDeliveries / input.totalDeliveryStops) * 100,
  };
};

export const firstAttemptDeliverySuccessPercentExample = {
  input: { firstAttemptDeliveries: 1600, totalDeliveryStops: 2000 },
  output: { firstAttemptSuccessPercent: 80 },
} satisfies ToolExample<
  FirstAttemptDeliverySuccessPercentInput,
  FirstAttemptDeliverySuccessPercentOutput
>;

export const firstAttemptDeliverySuccessPercentTool = createSimpleTool({
  id: "logistics/first-attempt-delivery-success-percent",
  title: "First Attempt Delivery Success Percent Calculator",
  description:
    "Compute the share of deliveries completed on the first attempt as a percent of all delivery stops.",
  inputs: [
    {
      description: "Stops delivered successfully on the first attempt.",
      id: "firstAttemptDeliveries",
      kind: "integer",
      label: "First-attempt successes",
      minimum: 0,
    },
    {
      description: "Total delivery stops attempted in the same period.",
      id: "totalDeliveryStops",
      kind: "integer",
      label: "Total stops",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "First-attempt success rate in percent.",
      id: "firstAttemptSuccessPercent",
      kind: "number",
      label: "First-attempt success",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFirstAttemptDeliverySuccessPercent({
      firstAttemptDeliveries: input.firstAttemptDeliveries as number,
      totalDeliveryStops: input.totalDeliveryStops as number,
    }),
});

export const runFirstAttemptDeliverySuccessPercent =
  firstAttemptDeliverySuccessPercentTool.execute;
export default firstAttemptDeliverySuccessPercentTool;
