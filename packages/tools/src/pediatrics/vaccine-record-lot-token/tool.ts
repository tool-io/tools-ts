import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly productWording: string;
  readonly lotId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    productWording: { type: "string", maxLength: 8192, minLength: 1 },
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "productWording", "lotId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicit vaccine record with supplied product and lot wording without recommending vaccination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, productWording, lotId } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(productWording.length > 0, "productWording");
    H.domain(lotId.length > 0, "lotId");
    return { token: JSON.stringify([recordId, productWording, lotId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "V17", productWording: "Product A", lotId: "LOT3" },
  output: { token: '["V17","Product A","LOT3"]' },
} satisfies ToolExample<Input, Output>;
export const vaccineRecordLotTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/vaccine-record-lot-token",
    title: "Vaccine Record Lot Token",
    description:
      "Associate an explicit vaccine record with supplied product and lot wording without recommending vaccination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        productWording: { type: "string", maxLength: 8192, minLength: 1 },
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "productWording", "lotId"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "productWording",
          label: "Product Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = vaccineRecordLotTokenTool.execute;
export default vaccineRecordLotTokenTool;
