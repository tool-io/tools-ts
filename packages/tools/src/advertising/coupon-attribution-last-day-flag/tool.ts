import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conversionDay: number;
  readonly expiryDay: number;
  readonly inclusive: boolean;
  readonly attributionSource: string;
};
export type Output = {
  readonly withinWindow: boolean;
  readonly source: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conversionDay: { type: "integer" },
    expiryDay: { type: "integer" },
    inclusive: { type: "boolean" },
    attributionSource: { type: "string", maxLength: 8192 },
  },
  required: ["conversionDay", "expiryDay", "inclusive", "attributionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinWindow: { type: "boolean" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["withinWindow", "source"],
} as const;
/** Retain attribution provenance while applying a supplied final-day inclusion rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conversionDay, expiryDay, inclusive, attributionSource } = request;
  const compute = (): Output => {
    H.domain(attributionSource.length > 0);
    return {
      withinWindow: inclusive
        ? conversionDay <= expiryDay
        : conversionDay < expiryDay,
      source: attributionSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    conversionDay: 10,
    expiryDay: 10,
    inclusive: true,
    attributionSource: "campaign-A",
  },
  output: { withinWindow: true, source: "campaign-A" },
} satisfies ToolExample<Input, Output>;
export const couponAttributionLastDayFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/coupon-attribution-last-day-flag",
    title: "Coupon Attribution Last Day Flag Tool",
    description:
      "Retain attribution provenance while applying a supplied final-day inclusion rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conversionDay: { type: "integer" },
        expiryDay: { type: "integer" },
        inclusive: { type: "boolean" },
        attributionSource: { type: "string", maxLength: 8192 },
      },
      required: [
        "conversionDay",
        "expiryDay",
        "inclusive",
        "attributionSource",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinWindow: { type: "boolean" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["withinWindow", "source"],
    },
    ports: {
      inputs: [
        {
          id: "conversionDay",
          label: "Conversion Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryDay",
          label: "Expiry Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "attributionSource",
          label: "Attribution Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = couponAttributionLastDayFlagTool.execute;
export default couponAttributionLastDayFlagTool;
