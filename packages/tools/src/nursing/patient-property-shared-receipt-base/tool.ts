import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstReceiptValue: number;
  readonly secondReceiptValue: number;
  readonly duplicateValue: number;
  readonly duplicateKnown: boolean;
};
export type Output = {
  readonly naiveValue: number;
  readonly uniqueValueDefined: boolean;
  readonly uniqueValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReceiptValue: { type: "number", minimum: 0 },
    secondReceiptValue: { type: "number", minimum: 0 },
    duplicateValue: { type: "number", minimum: 0 },
    duplicateKnown: { type: "boolean" },
  },
  required: [
    "firstReceiptValue",
    "secondReceiptValue",
    "duplicateValue",
    "duplicateKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    naiveValue: { type: "number" },
    uniqueValueDefined: { type: "boolean" },
    uniqueValue: { type: "number" },
  },
  required: ["naiveValue", "uniqueValueDefined", "uniqueValue"],
} as const;
/** Audit supplied property receipt totals and preserve unknown duplicate valuation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstReceiptValue,
    secondReceiptValue,
    duplicateValue,
    duplicateKnown,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstReceiptValue >= 0 &&
        secondReceiptValue >= 0 &&
        duplicateValue >= 0 &&
        duplicateValue <= Math.min(firstReceiptValue, secondReceiptValue),
    );
    return {
      naiveValue: firstReceiptValue + secondReceiptValue,
      uniqueValueDefined: duplicateKnown,
      uniqueValue: duplicateKnown
        ? firstReceiptValue + secondReceiptValue - duplicateValue
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstReceiptValue: 100,
    secondReceiptValue: 80,
    duplicateValue: 20,
    duplicateKnown: true,
  },
  output: { naiveValue: 180, uniqueValueDefined: true, uniqueValue: 160 },
} satisfies ToolExample<Input, Output>;
export const patientPropertySharedReceiptBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/patient-property-shared-receipt-base",
    title: "Patient Property Shared Receipt Base Tool",
    description:
      "Audit supplied property receipt totals and preserve unknown duplicate valuation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstReceiptValue: { type: "number", minimum: 0 },
        secondReceiptValue: { type: "number", minimum: 0 },
        duplicateValue: { type: "number", minimum: 0 },
        duplicateKnown: { type: "boolean" },
      },
      required: [
        "firstReceiptValue",
        "secondReceiptValue",
        "duplicateValue",
        "duplicateKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        naiveValue: { type: "number" },
        uniqueValueDefined: { type: "boolean" },
        uniqueValue: { type: "number" },
      },
      required: ["naiveValue", "uniqueValueDefined", "uniqueValue"],
    },
    ports: {
      inputs: [
        {
          id: "firstReceiptValue",
          label: "First Receipt Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReceiptValue",
          label: "Second Receipt Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duplicateValue",
          label: "Duplicate Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duplicateKnown",
          label: "Duplicate Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "naiveValue",
          label: "Naive Value",
          valueType: { type: "number" },
        },
        {
          id: "uniqueValueDefined",
          label: "Unique Value Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "uniqueValue",
          label: "Unique Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = patientPropertySharedReceiptBaseTool.execute;
export default patientPropertySharedReceiptBaseTool;
