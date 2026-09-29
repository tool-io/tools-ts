import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly imagedArea: number;
  readonly sampledFraction: number;
};
export type Output = {
  readonly countedArea: number;
  readonly density: number;
  readonly wholeFieldEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    imagedArea: { type: "number", exclusiveMinimum: 0 },
    sampledFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["count", "imagedArea", "sampledFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedArea: { type: "number" },
    density: { type: "number" },
    wholeFieldEquivalent: { type: "number" },
  },
  required: ["countedArea", "density", "wholeFieldEquivalent"],
} as const;
/** Observed nuclear density and homogeneous-field count expansion, without inferring cell density in a three-dimensional tissue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, imagedArea, sampledFraction } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.positive(imagedArea);
    H.domain(sampledFraction > 0 && sampledFraction <= 1);
    return {
      countedArea: imagedArea * sampledFraction,
      density: count / (imagedArea * sampledFraction),
      wholeFieldEquivalent: count / sampledFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 50, imagedArea: 2, sampledFraction: 0.5 },
  output: { countedArea: 1, density: 50, wholeFieldEquivalent: 100 },
} satisfies ToolExample<Input, Output>;
export const nuclearCountFieldAreaNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/nuclear-count-field-area-normalizer",
    title: "Nuclear Count Field Area Normalizer Tool",
    description:
      "Observed nuclear density and homogeneous-field count expansion, without inferring cell density in a three-dimensional tissue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        imagedArea: { type: "number", exclusiveMinimum: 0 },
        sampledFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["count", "imagedArea", "sampledFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedArea: { type: "number" },
        density: { type: "number" },
        wholeFieldEquivalent: { type: "number" },
      },
      required: ["countedArea", "density", "wholeFieldEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "imagedArea",
          label: "Imaged Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledFraction",
          label: "Sampled Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedArea",
          label: "Counted Area",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
        {
          id: "wholeFieldEquivalent",
          label: "Whole Field Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nuclearCountFieldAreaNormalizerTool.execute;
export default nuclearCountFieldAreaNormalizerTool;
