import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeMass: number;
  readonly totalFormMass: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMass: { type: "number", minimum: 0 },
    totalFormMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activeMass", "totalFormMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicitly supplied active mass to compatible total-form mass without estimating potency or a dose. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeMass, totalFormMass } = request;
  const compute = (): Output => {
    (H.domain(totalFormMass > 0, "totalFormMass"), totalFormMass);
    H.domain(activeMass >= 0 && activeMass <= totalFormMass, "activeMass");
    return {
      fraction: activeMass / totalFormMass,
      remainder: totalFormMass - activeMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activeMass: 30, totalFormMass: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const dosageFormActiveWeightFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["industrial-pharmacy", "industrial pharmacy", "pharmacy"],
      keywords: ["industrial pharmacy", "pharmacy"],
    },
    id: "industrial-pharmacy/dosage-form-active-weight-fraction",
    title: "Dosage Form Active Weight Fraction",
    description:
      "Normalize an explicitly supplied active mass to compatible total-form mass without estimating potency or a dose.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMass: { type: "number", minimum: 0 },
        totalFormMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["activeMass", "totalFormMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "activeMass",
          label: "Active Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFormMass",
          label: "Total Form Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dosageFormActiveWeightFractionTool.execute;
export default dosageFormActiveWeightFractionTool;
