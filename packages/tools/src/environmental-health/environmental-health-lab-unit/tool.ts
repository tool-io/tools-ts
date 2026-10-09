import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly value: number;
  readonly unitText: string;
  readonly matrixWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    value: { type: "number" },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    matrixWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "value", "unitText", "matrixWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit environmental laboratory value, unit, and sample matrix without assessing a safety threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, value, unitText, matrixWording } = request;
  const compute = (): Output => {
    H.domain(
      resultId.length > 0 && unitText.length > 0 && matrixWording.length > 0,
      "resultId",
    );
    return {
      label:
        resultId + "; " + value + " " + unitText + " [" + matrixWording + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    value: 2.5,
    unitText: "ug/L",
    matrixWording: "water",
  },
  output: { label: "R17; 2.5 ug/L [water]" },
} satisfies ToolExample<Input, Output>;
export const environmentalHealthLabUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/environmental-health-lab-unit",
    title: "Environmental Health Lab Unit",
    description:
      "Label an explicit environmental laboratory value, unit, and sample matrix without assessing a safety threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        value: { type: "number" },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        matrixWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "value", "unitText", "matrixWording"],
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
          id: "matrixWording",
          label: "Matrix Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = environmentalHealthLabUnitTool.execute;
export default environmentalHealthLabUnitTool;
