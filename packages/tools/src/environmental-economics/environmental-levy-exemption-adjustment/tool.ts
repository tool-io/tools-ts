import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossLevy: number;
  readonly suppliedExemption: number;
};
export type Output = { readonly netLevy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLevy: { type: "number", minimum: 0 },
    suppliedExemption: { type: "number", minimum: 0 },
  },
  required: ["grossLevy", "suppliedExemption"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netLevy: { type: "number" } },
  required: ["netLevy"],
} as const;
/** Subtract an explicitly supplied environmental levy exemption amount without determining legal eligibility or clipping inconsistencies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossLevy, suppliedExemption } = request;
  const compute = (): Output => {
    H.domain(grossLevy >= 0, "grossLevy");
    H.domain(suppliedExemption >= 0, "suppliedExemption");
    return { netLevy: grossLevy - suppliedExemption };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossLevy: 100, suppliedExemption: 25 },
  output: { netLevy: 75 },
} satisfies ToolExample<Input, Output>;
export const environmentalLevyExemptionAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/environmental-levy-exemption-adjustment",
      title: "Environmental Levy Exemption Adjustment Tool",
      description:
        "Subtract an explicitly supplied environmental levy exemption amount without determining legal eligibility or clipping inconsistencies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossLevy: { type: "number", minimum: 0 },
          suppliedExemption: { type: "number", minimum: 0 },
        },
        required: ["grossLevy", "suppliedExemption"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { netLevy: { type: "number" } },
        required: ["netLevy"],
      },
      ports: {
        inputs: [
          {
            id: "grossLevy",
            label: "Gross Levy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedExemption",
            label: "Supplied Exemption",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "netLevy", label: "Net Levy", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = environmentalLevyExemptionAdjustmentTool.execute;
export default environmentalLevyExemptionAdjustmentTool;
