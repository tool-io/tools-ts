import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bodyMass: number; readonly exponent: number };
export type Output = { readonly metabolicMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyMass: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["bodyMass", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { metabolicMass: { type: "number" } },
  required: ["metabolicMass"],
} as const;
/** Use an explicitly supplied allometric exponent; output units are mass units raised to that exponent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bodyMass, exponent } = request;
  const compute = (): Output => {
    H.positive(bodyMass);
    return { metabolicMass: bodyMass ** exponent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bodyMass: 16, exponent: 0.75 },
  output: { metabolicMass: 8 },
} satisfies ToolExample<Input, Output>;
export const livestockMetabolicBodyWeightFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/livestock-metabolic-body-weight-factor",
    title: "Livestock Metabolic Body Weight Factor Tool",
    description:
      "Use an explicitly supplied allometric exponent; output units are mass units raised to that exponent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyMass: { type: "number", exclusiveMinimum: 0 },
        exponent: { type: "number" },
      },
      required: ["bodyMass", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { metabolicMass: { type: "number" } },
      required: ["metabolicMass"],
    },
    ports: {
      inputs: [
        {
          id: "bodyMass",
          label: "Body Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "metabolicMass",
          label: "Metabolic Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockMetabolicBodyWeightFactorTool.execute;
export default livestockMetabolicBodyWeightFactorTool;
