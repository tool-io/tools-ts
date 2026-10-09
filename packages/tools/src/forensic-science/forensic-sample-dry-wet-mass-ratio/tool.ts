import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dryMass: number; readonly wetMass: number };
export type Output = {
  readonly dryFraction: number;
  readonly waterMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    wetMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryMass", "wetMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryFraction: { type: "number" },
    waterMass: { type: "number" },
  },
  required: ["dryFraction", "waterMass"],
} as const;
/** Calculate explicit dry-to-wet sample mass fraction and mass difference without identifying material or predicting stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, wetMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(wetMass) && wetMass > 0, "wetMass"), wetMass);
    H.domain(dryMass >= 0 && dryMass <= wetMass, "dryMass");
    return { dryFraction: dryMass / wetMass, waterMass: wetMass - dryMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 3, wetMass: 12 },
  output: { dryFraction: 0.25, waterMass: 9 },
} satisfies ToolExample<Input, Output>;
export const forensicSampleDryWetMassRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/forensic-sample-dry-wet-mass-ratio",
    title: "Forensic Sample Dry Wet Mass Ratio Tool",
    description:
      "Calculate explicit dry-to-wet sample mass fraction and mass difference without identifying material or predicting stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", minimum: 0 },
        wetMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryMass", "wetMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryFraction: { type: "number" },
        waterMass: { type: "number" },
      },
      required: ["dryFraction", "waterMass"],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forensicSampleDryWetMassRatioTool.execute;
export default forensicSampleDryWetMassRatioTool;
