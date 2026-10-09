import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly comparator: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparator: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">=", ">", "ad"],
    },
  },
  required: ["comparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Validate and preserve one of the five FHIR R5 Quantity comparator codes without interpreting a quantity or converting to another FHIR release. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { comparator } = request;
  const compute = (): Output => {
    H.domain(["<", "<=", ">=", ">", "ad"].includes(comparator), "comparator");
    return { token: comparator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { comparator: "<" },
  output: { token: "<" },
} satisfies ToolExample<Input, Output>;
export const fhirQuantityComparatorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-quantity-comparator-token",
    title: "FHIR Quantity Comparator Token Tool",
    description:
      "Validate and preserve one of the five FHIR R5 Quantity comparator codes without interpreting a quantity or converting to another FHIR release.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparator: {
          type: "string",
          maxLength: 8192,
          enum: ["<", "<=", ">=", ">", "ad"],
        },
      },
      required: ["comparator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "comparator",
          label: "Comparator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fhirQuantityComparatorTokenTool.execute;
export default fhirQuantityComparatorTokenTool;
