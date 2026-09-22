import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleArea: number;
  readonly processedFraction: number;
  readonly organisms: number;
};
export type Output = {
  readonly effectiveArea: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleArea: { type: "number", exclusiveMinimum: 0 },
    processedFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    organisms: { type: "integer", minimum: 0 },
  },
  required: ["sampleArea", "processedFraction", "organisms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveArea: { type: "number" },
    density: { type: "number" },
  },
  required: ["effectiveArea", "density"],
} as const;
/** Calculate benthic sample sieved fraction area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleArea, processedFraction, organisms } = request;
  const compute = (): Output => {
    H.positive(sampleArea);
    H.domain(processedFraction > 0 && processedFraction <= 1);
    H.integer(organisms, 0);
    return {
      effectiveArea: sampleArea * processedFraction,
      density: organisms / (sampleArea * processedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleArea: 0.2, processedFraction: 0.5, organisms: 30 },
  output: { effectiveArea: 0.1, density: 300 },
} satisfies ToolExample<Input, Output>;
export const benthicSampleSievedFractionAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/benthic-sample-sieved-fraction-area",
    title: "Benthic Sample Sieved Fraction Area Tool",
    description:
      "Calculate benthic sample sieved fraction area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleArea: { type: "number", exclusiveMinimum: 0 },
        processedFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        organisms: { type: "integer", minimum: 0 },
      },
      required: ["sampleArea", "processedFraction", "organisms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveArea: { type: "number" },
        density: { type: "number" },
      },
      required: ["effectiveArea", "density"],
    },
    ports: {
      inputs: [
        {
          id: "sampleArea",
          label: "Sample Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processedFraction",
          label: "Processed Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "organisms",
          label: "Organisms",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "effectiveArea",
          label: "Effective Area",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benthicSampleSievedFractionAreaTool.execute;
export default benthicSampleSievedFractionAreaTool;
