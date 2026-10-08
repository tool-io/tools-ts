import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limit: number;
  readonly unit: string;
  readonly comparator: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number" },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
    comparator: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">="],
    },
  },
  required: ["limit", "unit", "comparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly censored dermatology result threshold without replacing it by a point estimate or interpreting the result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, unit, comparator } = request;
  const compute = (): Output => {
    H.domain(unit.length > 0, "unit");
    H.domain(["<", "<=", ">", ">="].includes(comparator), "comparator");
    return { label: comparator + " " + limit + " " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 0.5, unit: "units", comparator: "<" },
  output: { label: "< 0.5 units" },
} satisfies ToolExample<Input, Output>;
export const dermatologyResultCensoredValueLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["dermatology", "health and medicine"],
        keywords: ["dermatology", "health and medicine"],
      },
      id: "dermatology/dermatology-result-censored-value-label",
      title: "Dermatology Result Censored Value Label",
      description:
        "Format an explicitly censored dermatology result threshold without replacing it by a point estimate or interpreting the result.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          limit: { type: "number" },
          unit: { type: "string", maxLength: 8192, minLength: 1 },
          comparator: {
            type: "string",
            maxLength: 8192,
            enum: ["<", "<=", ">", ">="],
          },
        },
        required: ["limit", "unit", "comparator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "limit",
            label: "Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unit",
            label: "Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "comparator",
            label: "Comparator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = dermatologyResultCensoredValueLabelTool.execute;
export default dermatologyResultCensoredValueLabelTool;
