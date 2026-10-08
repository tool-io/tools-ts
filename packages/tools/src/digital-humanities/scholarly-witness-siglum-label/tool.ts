import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly witnessId: string; readonly siglum: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    siglum: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["witnessId", "siglum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Pair an explicit scholarly witness identifier and display siglum without resolving a manuscript catalogue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { witnessId, siglum } = request;
  const compute = (): Output => {
    H.domain(witnessId.length > 0 && siglum.length > 0, "witnessId");
    return { label: siglum + " [" + witnessId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { witnessId: "W17", siglum: "A" },
  output: { label: "A [W17]" },
} satisfies ToolExample<Input, Output>;
export const scholarlyWitnessSiglumLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/scholarly-witness-siglum-label",
    title: "Scholarly Witness Siglum Label",
    description:
      "Pair an explicit scholarly witness identifier and display siglum without resolving a manuscript catalogue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        witnessId: { type: "string", maxLength: 8192, minLength: 1 },
        siglum: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["witnessId", "siglum"],
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
          id: "witnessId",
          label: "Witness Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "siglum",
          label: "Siglum",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = scholarlyWitnessSiglumLabelTool.execute;
export default scholarlyWitnessSiglumLabelTool;
