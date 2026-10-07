import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly medicineId: string;
  readonly formulationWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medicineId: { type: "string", maxLength: 8192, minLength: 1 },
    formulationWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["medicineId", "formulationWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit medicine formulation wording without selecting a formulation or dose. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { medicineId, formulationWording, source } = request;
  const compute = (): Output => {
    H.domain(medicineId.length > 0, "medicineId");
    H.domain(formulationWording.length > 0, "formulationWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([medicineId, formulationWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    medicineId: "MED17",
    formulationWording: "tablet",
    source: "Order record",
  },
  output: { token: '["MED17","tablet","Order record"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalMedicineFormulationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/clinical-medicine-formulation-token",
    title: "Clinical Medicine Formulation Token",
    description:
      "Qualify explicit medicine formulation wording without selecting a formulation or dose.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        medicineId: { type: "string", maxLength: 8192, minLength: 1 },
        formulationWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["medicineId", "formulationWording", "source"],
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
          id: "medicineId",
          label: "Medicine Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "formulationWording",
          label: "Formulation Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalMedicineFormulationTokenTool.execute;
export default clinicalMedicineFormulationTokenTool;
