import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly storage: number; readonly loss: number };
export type Output = {
  readonly complianceStorage: number;
  readonly complianceLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { storage: { type: "number" }, loss: { type: "number" } },
  required: ["storage", "loss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complianceStorage: { type: "number" },
    complianceLoss: { type: "number" },
  },
  required: ["complianceStorage", "complianceLoss"],
} as const;
/** Invert the supplied complex modulus storage+i*loss, returning the signed imaginary compliance component. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storage, loss } = request;
  const compute = (): Output => {
    H.domain(storage * storage + loss * loss > 0);
    const d = storage * storage + loss * loss;
    return { complianceStorage: storage / d, complianceLoss: -loss / d };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storage: 3, loss: 4 },
  output: { complianceStorage: 0.12, complianceLoss: -0.16 },
} satisfies ToolExample<Input, Output>;
export const dynamicElasticComplianceModulusReciprocalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/dynamic-elastic-compliance-modulus-reciprocal",
      title: "Dynamic Elastic Compliance Modulus Reciprocal Tool",
      description:
        "Invert the supplied complex modulus storage+i*loss, returning the signed imaginary compliance component.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { storage: { type: "number" }, loss: { type: "number" } },
        required: ["storage", "loss"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          complianceStorage: { type: "number" },
          complianceLoss: { type: "number" },
        },
        required: ["complianceStorage", "complianceLoss"],
      },
      ports: {
        inputs: [
          {
            id: "storage",
            label: "Storage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "loss",
            label: "Loss",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "complianceStorage",
            label: "Compliance Storage",
            valueType: { type: "number" },
          },
          {
            id: "complianceLoss",
            label: "Compliance Loss",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dynamicElasticComplianceModulusReciprocalTool.execute;
export default dynamicElasticComplianceModulusReciprocalTool;
