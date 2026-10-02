import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intensity: number;
  readonly referenceIntensity: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intensity: { type: "number", minimum: 0 },
    referenceIntensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["intensity", "referenceIntensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate stain reference intensity ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intensity, referenceIntensity } = request;
  const compute = (): Output => {
    H.domain(intensity >= 0);
    H.positive(referenceIntensity);
    return { ratio: intensity / referenceIntensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intensity: 12, referenceIntensity: 10 },
  output: { ratio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const stainReferenceIntensityRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/stain-reference-intensity-ratio",
    title: "Stain Reference Intensity Ratio Tool",
    description:
      "Calculate stain reference intensity ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intensity: { type: "number", minimum: 0 },
        referenceIntensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["intensity", "referenceIntensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "intensity",
          label: "Intensity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceIntensity",
          label: "Reference Intensity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = stainReferenceIntensityRatioTool.execute;
export default stainReferenceIntensityRatioTool;
