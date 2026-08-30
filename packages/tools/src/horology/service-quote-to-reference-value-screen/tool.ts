import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ServiceQuoteRatioInput = {
  readonly maximumAllowedPercentOfReferenceValue: number;
  readonly quotedServiceCost: number;
  readonly referenceValue: number;
};

export type ServiceQuoteRatioOutput = {
  readonly withinCallerPercentage: boolean;
  readonly costPercentOfReferenceValue: number;
  readonly percentagePointHeadroom: number;
};

export const screenServiceQuoteToReferenceValue = (
  input: ServiceQuoteRatioInput,
): ServiceQuoteRatioOutput => {
  if (!Number.isFinite(input.referenceValue) || input.referenceValue <= 0)
    simpleError(
      "referenceValue",
      "Reference value must be finite and positive.",
      "reference_value_invalid",
    );
  if (!Number.isFinite(input.quotedServiceCost) || input.quotedServiceCost < 0)
    simpleError(
      "quotedServiceCost",
      "Quoted service cost must be finite and nonnegative.",
      "quote_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedPercentOfReferenceValue) ||
    input.maximumAllowedPercentOfReferenceValue < 0
  )
    simpleError(
      "maximumAllowedPercentOfReferenceValue",
      "Percentage limit must be finite and nonnegative.",
      "percentage_limit_invalid",
    );
  const costPercentOfReferenceValue =
    (100 * input.quotedServiceCost) / input.referenceValue;
  return {
    costPercentOfReferenceValue,
    percentagePointHeadroom:
      input.maximumAllowedPercentOfReferenceValue - costPercentOfReferenceValue,
    withinCallerPercentage:
      costPercentOfReferenceValue <=
      input.maximumAllowedPercentOfReferenceValue,
  };
};

export const serviceQuoteRatioExample = {
  input: {
    maximumAllowedPercentOfReferenceValue: 25,
    quotedServiceCost: 1200,
    referenceValue: 5000,
  },
  output: {
    costPercentOfReferenceValue: 24,
    percentagePointHeadroom: 1,
    withinCallerPercentage: true,
  },
} satisfies ToolExample<ServiceQuoteRatioInput, ServiceQuoteRatioOutput>;

export const serviceQuoteRatioTool = createSimpleTool({
  calculate: (input) =>
    screenServiceQuoteToReferenceValue({
      maximumAllowedPercentOfReferenceValue:
        input.maximumAllowedPercentOfReferenceValue as number,
      quotedServiceCost: input.quotedServiceCost as number,
      referenceValue: input.referenceValue as number,
    }),
  description:
    "Compare a service quote with a caller-defined reference value and explicit percentage ceiling; no universal service-cost-to-value heuristic is applied.",
  id: "horology/service-quote-to-reference-value-screen",
  inputs: [
    {
      id: "maximumAllowedPercentOfReferenceValue",
      kind: "number",
      label: "Maximum allowed service-cost percentage",
      minimum: 0,
      unit: "%",
    },
    {
      id: "quotedServiceCost",
      kind: "number",
      label: "Quoted service cost",
      minimum: 0,
    },
    {
      id: "referenceValue",
      kind: "number",
      label: "Caller-defined reference value",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "costPercentOfReferenceValue",
      kind: "number",
      label: "Service cost as percent of reference value",
      minimum: 0,
      unit: "%",
    },
    {
      id: "percentagePointHeadroom",
      kind: "number",
      label: "Percentage-point headroom",
      unit: "percentage point",
    },
    {
      id: "withinCallerPercentage",
      kind: "boolean",
      label: "Within caller percentage",
    },
  ],
  title: "Service Quote to Reference Value Screen",
});

export const runServiceQuoteRatio = serviceQuoteRatioTool.execute;
export default serviceQuoteRatioTool;
