import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly limit: number;
  readonly qualifier: string;
};
export type Output = {
  readonly pointDifference: number;
  readonly relation: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    limit: { type: "number" },
    qualifier: {
      type: "string",
      maxLength: 8192,
      enum: ["exact", "less-than", "greater-than"],
    },
  },
  required: ["value", "limit", "qualifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointDifference: { type: "number" },
    relation: { type: "string", maxLength: 8192 },
  },
  required: ["pointDifference", "relation"],
} as const;
/** Compare an exact or strictly censored observation with an explicit limit, retaining indeterminate relations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, limit, qualifier } = request;
  const compute = (): Output => {
    H.domain(["exact", "less-than", "greater-than"].includes(qualifier));
    return {
      pointDifference: value - limit,
      relation:
        qualifier === "exact"
          ? value < limit
            ? "below"
            : value > limit
              ? "above"
              : "equal"
          : qualifier === "less-than" && value <= limit
            ? "below"
            : qualifier === "greater-than" && value >= limit
              ? "above"
              : "indeterminate",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, limit: 5, qualifier: "less-than" },
  output: { pointDifference: 0, relation: "below" },
} satisfies ToolExample<Input, Output>;
export const environmentalLimitQualifierSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/environmental-limit-qualifier-sign",
    title: "Environmental Limit Qualifier Sign Tool",
    description:
      "Compare an exact or strictly censored observation with an explicit limit, retaining indeterminate relations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        limit: { type: "number" },
        qualifier: {
          type: "string",
          maxLength: 8192,
          enum: ["exact", "less-than", "greater-than"],
        },
      },
      required: ["value", "limit", "qualifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointDifference: { type: "number" },
        relation: { type: "string", maxLength: 8192 },
      },
      required: ["pointDifference", "relation"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "qualifier",
          label: "Qualifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "pointDifference",
          label: "Point Difference",
          valueType: { type: "number" },
        },
        { id: "relation", label: "Relation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = environmentalLimitQualifierSignTool.execute;
export default environmentalLimitQualifierSignTool;
