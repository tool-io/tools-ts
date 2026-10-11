import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetSampleMass: number;
  readonly moistureFraction: number;
};
export type Output = { readonly drySampleMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetSampleMass: { type: "number", minimum: 0 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetSampleMass", "moistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { drySampleMass: { type: "number" } },
  required: ["drySampleMass"],
} as const;
/** Apply an explicitly supplied wet-basis moisture fraction to sample mass without measuring moisture content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetSampleMass, moistureFraction } = request;
  const compute = (): Output => {
    H.domain(wetSampleMass >= 0, "wetSampleMass");
    (H.domain(
      moistureFraction >= 0 && moistureFraction <= 1,
      "moistureFraction",
    ),
      moistureFraction);
    return { drySampleMass: wetSampleMass * (1 - moistureFraction) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetSampleMass: 100, moistureFraction: 0.2 },
  output: { drySampleMass: 80 },
} satisfies ToolExample<Input, Output>;
export const qcSampleDryMassCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-sample-dry-mass-correction",
    title: "QC Sample Dry Mass Correction",
    description:
      "Apply an explicitly supplied wet-basis moisture fraction to sample mass without measuring moisture content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetSampleMass: { type: "number", minimum: 0 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["wetSampleMass", "moistureFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { drySampleMass: { type: "number" } },
      required: ["drySampleMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetSampleMass",
          label: "Wet Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "drySampleMass",
          label: "Dry Sample Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcSampleDryMassCorrectionTool.execute;
export default qcSampleDryMassCorrectionTool;
