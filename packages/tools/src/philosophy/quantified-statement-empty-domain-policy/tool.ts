import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predicateValues: readonly boolean[];
  readonly quantifier: string;
  readonly allowEmpty: boolean;
};
export type Output = { readonly value: boolean; readonly empty: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predicateValues: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    quantifier: { type: "string", maxLength: 8192, enum: ["all", "some"] },
    allowEmpty: { type: "boolean" },
  },
  required: ["predicateValues", "quantifier", "allowEmpty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "boolean" }, empty: { type: "boolean" } },
  required: ["value", "empty"],
} as const;
/** Classical finite quantification with an explicit empty-domain admission flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predicateValues, quantifier, allowEmpty } = request;
  const compute = (): Output => {
    H.domain(["all", "some"].includes(quantifier));
    H.domain(allowEmpty || predicateValues.length > 0);
    return {
      value:
        quantifier === "all"
          ? predicateValues.every(Boolean)
          : predicateValues.some(Boolean),
      empty: predicateValues.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predicateValues: [], quantifier: "all", allowEmpty: true },
  output: { value: true, empty: true },
} satisfies ToolExample<Input, Output>;
export const quantifiedStatementEmptyDomainPolicyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/quantified-statement-empty-domain-policy",
      title: "Quantified Statement Empty Domain Policy Tool",
      description:
        "Classical finite quantification with an explicit empty-domain admission flag.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predicateValues: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          quantifier: {
            type: "string",
            maxLength: 8192,
            enum: ["all", "some"],
          },
          allowEmpty: { type: "boolean" },
        },
        required: ["predicateValues", "quantifier", "allowEmpty"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "boolean" }, empty: { type: "boolean" } },
        required: ["value", "empty"],
      },
      ports: {
        inputs: [
          {
            id: "predicateValues",
            label: "Predicate Values",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "quantifier",
            label: "Quantifier",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "allowEmpty",
            label: "Allow Empty",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "value", label: "Value", valueType: { type: "boolean" } },
          { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = quantifiedStatementEmptyDomainPolicyTool.execute;
export default quantifiedStatementEmptyDomainPolicyTool;
