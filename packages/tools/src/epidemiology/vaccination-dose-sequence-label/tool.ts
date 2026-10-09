import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly doseNumber: number;
  readonly productWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192, minLength: 1 },
    doseNumber: { type: "integer", minimum: 1 },
    productWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordCode", "doseNumber", "productWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a supplied vaccination dose ordinal and product wording without validating a schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, doseNumber, productWording } = request;
  const compute = (): Output => {
    H.domain(recordCode.length > 0 && productWording.length > 0, "recordCode");
    (H.domain(
      Number.isSafeInteger(doseNumber) &&
        doseNumber >= 1 &&
        doseNumber <= Number.MAX_SAFE_INTEGER,
      "doseNumber",
    ),
      doseNumber);
    return {
      label:
        recordCode + "; recorded dose " + doseNumber + "; " + productWording,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordCode: "V17", doseNumber: 2, productWording: "Product A" },
  output: { label: "V17; recorded dose 2; Product A" },
} satisfies ToolExample<Input, Output>;
export const vaccinationDoseSequenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/vaccination-dose-sequence-label",
    title: "Vaccination Dose Sequence Label",
    description:
      "Format a supplied vaccination dose ordinal and product wording without validating a schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCode: { type: "string", maxLength: 8192, minLength: 1 },
        doseNumber: { type: "integer", minimum: 1 },
        productWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordCode", "doseNumber", "productWording"],
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
          id: "recordCode",
          label: "Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "doseNumber",
          label: "Dose Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "productWording",
          label: "Product Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = vaccinationDoseSequenceLabelTool.execute;
export default vaccinationDoseSequenceLabelTool;
