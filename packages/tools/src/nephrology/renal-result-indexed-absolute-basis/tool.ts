import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly value: number;
  readonly unitText: string;
  readonly indexed: boolean;
  readonly referenceAreaSquareMeters: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    value: { type: "number" },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    indexed: { type: "boolean" },
    referenceAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "resultId",
    "value",
    "unitText",
    "indexed",
    "referenceAreaSquareMeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly supplied indexed or absolute renal-result wording without converting body-surface-area bases or estimating renal function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, value, unitText, indexed, referenceAreaSquareMeters } =
    request;
  const compute = (): Output => {
    H.domain(resultId.length > 0 && unitText.length > 0, "resultId");
    (H.domain(referenceAreaSquareMeters > 0, "referenceAreaSquareMeters"),
      referenceAreaSquareMeters);
    return {
      label:
        resultId +
        "; " +
        value +
        " " +
        unitText +
        " [" +
        (indexed
          ? "indexed to " + referenceAreaSquareMeters + " m^2"
          : "absolute") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    value: 90,
    unitText: "mL/min",
    indexed: true,
    referenceAreaSquareMeters: 1.73,
  },
  output: { label: "R17; 90 mL/min [indexed to 1.73 m^2]" },
} satisfies ToolExample<Input, Output>;
export const renalResultIndexedAbsoluteBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/renal-result-indexed-absolute-basis",
    title: "Renal Result Indexed Absolute Basis",
    description:
      "Label explicitly supplied indexed or absolute renal-result wording without converting body-surface-area bases or estimating renal function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        value: { type: "number" },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        indexed: { type: "boolean" },
        referenceAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "resultId",
        "value",
        "unitText",
        "indexed",
        "referenceAreaSquareMeters",
      ],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "indexed",
          label: "Indexed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "referenceAreaSquareMeters",
          label: "Reference Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = renalResultIndexedAbsoluteBasisTool.execute;
export default renalResultIndexedAbsoluteBasisTool;
