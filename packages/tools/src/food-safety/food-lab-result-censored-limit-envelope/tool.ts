import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly qualifier: string;
  readonly reportedValue: number;
  readonly limit: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly lowerInclusive: boolean;
  readonly upperInclusive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    qualifier: {
      type: "string",
      maxLength: 8192,
      enum: ["exact", "less-than", "not-greater-than"],
    },
    reportedValue: { type: "number", minimum: 0 },
    limit: { type: "number", minimum: 0 },
  },
  required: ["qualifier", "reportedValue", "limit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    lowerInclusive: { type: "boolean" },
    upperInclusive: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerInclusive", "upperInclusive"],
} as const;
/** Preserve a nonnegative censored-result interval instead of substituting half the reporting limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { qualifier, reportedValue, limit } = request;
  const compute = (): Output => {
    H.domain(
      ["exact", "less-than", "not-greater-than"].includes(qualifier) &&
        reportedValue >= 0 &&
        limit >= 0,
    );
    return qualifier === "exact"
      ? {
          lower: reportedValue,
          upper: reportedValue,
          lowerInclusive: true,
          upperInclusive: true,
        }
      : {
          lower: 0,
          upper: limit,
          lowerInclusive: true,
          upperInclusive: qualifier === "not-greater-than",
        };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { qualifier: "less-than", reportedValue: 0, limit: 2 },
  output: { lower: 0, upper: 2, lowerInclusive: true, upperInclusive: false },
} satisfies ToolExample<Input, Output>;
export const foodLabResultCensoredLimitEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-lab-result-censored-limit-envelope",
    title: "Food Lab Result Censored Limit Envelope Tool",
    description:
      "Preserve a nonnegative censored-result interval instead of substituting half the reporting limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        qualifier: {
          type: "string",
          maxLength: 8192,
          enum: ["exact", "less-than", "not-greater-than"],
        },
        reportedValue: { type: "number", minimum: 0 },
        limit: { type: "number", minimum: 0 },
      },
      required: ["qualifier", "reportedValue", "limit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        lowerInclusive: { type: "boolean" },
        upperInclusive: { type: "boolean" },
      },
      required: ["lower", "upper", "lowerInclusive", "upperInclusive"],
    },
    ports: {
      inputs: [
        {
          id: "qualifier",
          label: "Qualifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          valueType: { type: "boolean" },
        },
        {
          id: "upperInclusive",
          label: "Upper Inclusive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodLabResultCensoredLimitEnvelopeTool.execute;
export default foodLabResultCensoredLimitEnvelopeTool;
