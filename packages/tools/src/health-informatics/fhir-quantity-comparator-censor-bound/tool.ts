import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly comparator: string };
export type Output = {
  readonly lowerBoundPresent: boolean;
  readonly upperBoundPresent: boolean;
  readonly inclusive: boolean;
  readonly bound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    comparator: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">="],
    },
  },
  required: ["value", "comparator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBoundPresent: { type: "boolean" },
    upperBoundPresent: { type: "boolean" },
    inclusive: { type: "boolean" },
    bound: { type: "number" },
  },
  required: ["lowerBoundPresent", "upperBoundPresent", "inclusive", "bound"],
} as const;
/** Interpret one of the four ordered FHIR Quantity comparators as a one-sided numeric bound. Return the bound, side and inclusivity; approximate values and absent comparators are outside this operation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, comparator } = request;
  const compute = (): Output => {
    H.domain(["<", "<=", ">", ">="].includes(comparator));
    return {
      bound: value,
      lowerBoundPresent: comparator === ">" || comparator === ">=",
      upperBoundPresent: comparator === "<" || comparator === "<=",
      inclusive: comparator === ">=" || comparator === "<=",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, comparator: "<" },
  output: {
    lowerBoundPresent: false,
    upperBoundPresent: true,
    inclusive: false,
    bound: 5,
  },
} satisfies ToolExample<Input, Output>;
export const fhirQuantityComparatorCensorBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-quantity-comparator-censor-bound",
    title: "FHIR Quantity Comparator Censor Bound Tool",
    description:
      "Interpret one of the four ordered FHIR Quantity comparators as a one-sided numeric bound. Return the bound, side and inclusivity; approximate values and absent comparators are outside this operation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        comparator: {
          type: "string",
          maxLength: 8192,
          enum: ["<", "<=", ">", ">="],
        },
      },
      required: ["value", "comparator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBoundPresent: { type: "boolean" },
        upperBoundPresent: { type: "boolean" },
        inclusive: { type: "boolean" },
        bound: { type: "number" },
      },
      required: [
        "lowerBoundPresent",
        "upperBoundPresent",
        "inclusive",
        "bound",
      ],
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
          id: "comparator",
          label: "Comparator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "lowerBoundPresent",
          label: "Lower Bound Present",
          valueType: { type: "boolean" },
        },
        {
          id: "upperBoundPresent",
          label: "Upper Bound Present",
          valueType: { type: "boolean" },
        },
        { id: "inclusive", label: "Inclusive", valueType: { type: "boolean" } },
        { id: "bound", label: "Bound", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fhirQuantityComparatorCensorBoundTool.execute;
export default fhirQuantityComparatorCensorBoundTool;
