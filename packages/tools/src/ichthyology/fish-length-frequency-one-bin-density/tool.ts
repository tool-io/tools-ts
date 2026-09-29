import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly total: number;
  readonly lowerLength: number;
  readonly upperLength: number;
  readonly sampledFraction: number;
};
export type Output = {
  readonly relativeFrequency: number;
  readonly density: number;
  readonly expandedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    total: { type: "integer", minimum: 1 },
    lowerLength: { type: "number" },
    upperLength: { type: "number" },
    sampledFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["count", "total", "lowerLength", "upperLength", "sampledFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeFrequency: { type: "number" },
    density: { type: "number" },
    expandedCount: { type: "number" },
  },
  required: ["relativeFrequency", "density", "expandedCount"],
} as const;
/** Calculate fish length frequency one bin density from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, total, lowerLength, upperLength, sampledFraction } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(count, 0, total);
    H.domain(
      upperLength > lowerLength && sampledFraction > 0 && sampledFraction <= 1,
    );
    return {
      relativeFrequency: count / total,
      density: count / (total * (upperLength - lowerLength)),
      expandedCount: count / sampledFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    count: 20,
    total: 100,
    lowerLength: 10,
    upperLength: 15,
    sampledFraction: 0.5,
  },
  output: { relativeFrequency: 0.2, density: 0.04, expandedCount: 40 },
} satisfies ToolExample<Input, Output>;
export const fishLengthFrequencyOneBinDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-length-frequency-one-bin-density",
    title: "Fish Length Frequency One Bin Density Tool",
    description:
      "Calculate fish length frequency one bin density from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        total: { type: "integer", minimum: 1 },
        lowerLength: { type: "number" },
        upperLength: { type: "number" },
        sampledFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: [
        "count",
        "total",
        "lowerLength",
        "upperLength",
        "sampledFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeFrequency: { type: "number" },
        density: { type: "number" },
        expandedCount: { type: "number" },
      },
      required: ["relativeFrequency", "density", "expandedCount"],
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
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lowerLength",
          label: "Lower Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperLength",
          label: "Upper Length",
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
          id: "relativeFrequency",
          label: "Relative Frequency",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
        {
          id: "expandedCount",
          label: "Expanded Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishLengthFrequencyOneBinDensityTool.execute;
export default fishLengthFrequencyOneBinDensityTool;
