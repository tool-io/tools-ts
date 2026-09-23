import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly limit: number; readonly comparator: string };
export type Output = {
  readonly lowerPresent: boolean;
  readonly upperPresent: boolean;
  readonly bound: number;
  readonly inclusive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number" },
    comparator: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">="],
    },
  },
  required: ["limit", "comparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerPresent: { type: "boolean" },
    upperPresent: { type: "boolean" },
    bound: { type: "number" },
    inclusive: { type: "boolean" },
  },
  required: ["lowerPresent", "upperPresent", "bound", "inclusive"],
} as const;
/** Represent a supplied one-sided assay censor bound without substituting a concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, comparator } = request;
  const compute = (): Output => {
    H.domain(["<", "<=", ">", ">="].includes(comparator), "comparator");
    return {
      lowerPresent: comparator.startsWith(">"),
      upperPresent: comparator.startsWith("<"),
      bound: limit,
      inclusive: comparator.endsWith("="),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 5, comparator: "<" },
  output: {
    lowerPresent: false,
    upperPresent: true,
    bound: 5,
    inclusive: false,
  },
} satisfies ToolExample<Input, Output>;
export const remediationLabResultCensoredEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/remediation-lab-result-censored-envelope",
      title: "Remediation Lab Result Censored Envelope Tool",
      description:
        "Represent a supplied one-sided assay censor bound without substituting a concentration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          limit: { type: "number" },
          comparator: {
            type: "string",
            maxLength: 8192,
            enum: ["<", "<=", ">", ">="],
          },
        },
        required: ["limit", "comparator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowerPresent: { type: "boolean" },
          upperPresent: { type: "boolean" },
          bound: { type: "number" },
          inclusive: { type: "boolean" },
        },
        required: ["lowerPresent", "upperPresent", "bound", "inclusive"],
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
            id: "comparator",
            label: "Comparator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lowerPresent",
            label: "Lower Present",
            valueType: { type: "boolean" },
          },
          {
            id: "upperPresent",
            label: "Upper Present",
            valueType: { type: "boolean" },
          },
          { id: "bound", label: "Bound", valueType: { type: "number" } },
          {
            id: "inclusive",
            label: "Inclusive",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = remediationLabResultCensoredEnvelopeTool.execute;
export default remediationLabResultCensoredEnvelopeTool;
