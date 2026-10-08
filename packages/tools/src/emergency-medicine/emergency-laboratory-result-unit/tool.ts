import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultCode: string;
  readonly valueText: string;
  readonly unit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultCode: { type: "string", maxLength: 8192, minLength: 1 },
    valueText: { type: "string", maxLength: 8192, minLength: 1 },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultCode", "valueText", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve a literal emergency laboratory result and supplied unit without converting, classifying or interpreting the result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultCode, valueText, unit } = request;
  const compute = (): Output => {
    H.domain(
      resultCode.length > 0 && valueText.length > 0 && unit.length > 0,
      "resultCode",
    );
    return { label: resultCode + ": " + valueText + " " + unit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultCode: "R17", valueText: "<0.5", unit: "mg/L" },
  output: { label: "R17: <0.5 mg/L" },
} satisfies ToolExample<Input, Output>;
export const emergencyLaboratoryResultUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/emergency-laboratory-result-unit",
    title: "Emergency Laboratory Result Unit",
    description:
      "Preserve a literal emergency laboratory result and supplied unit without converting, classifying or interpreting the result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultCode: { type: "string", maxLength: 8192, minLength: 1 },
        valueText: { type: "string", maxLength: 8192, minLength: 1 },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultCode", "valueText", "unit"],
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
          id: "resultCode",
          label: "Result Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "valueText",
          label: "Value Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emergencyLaboratoryResultUnitTool.execute;
export default emergencyLaboratoryResultUnitTool;
