import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampledArea: number;
  readonly targetArea: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly samplingFraction: number;
  readonly expansionWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledArea: { type: "number", exclusiveMinimum: 0 },
    targetArea: { type: "number" },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["sampledArea", "targetArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    samplingFraction: { type: "number" },
    expansionWeight: { type: "number" },
  },
  required: ["eligibleArea", "samplingFraction", "expansionWeight"],
} as const;
/** Return area sampling fraction and inverse expansion weight under an explicit equal-inclusion area design assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampledArea, targetArea, excludedArea } = request;
  const compute = (): Output => {
    H.positive(sampledArea);
    H.domain(
      targetArea > excludedArea &&
        excludedArea >= 0 &&
        sampledArea <= targetArea - excludedArea,
    );
    return {
      eligibleArea: targetArea - excludedArea,
      samplingFraction: sampledArea / (targetArea - excludedArea),
      expansionWeight: (targetArea - excludedArea) / sampledArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampledArea: 10, targetArea: 100, excludedArea: 20 },
  output: { eligibleArea: 80, samplingFraction: 0.125, expansionWeight: 8 },
} satisfies ToolExample<Input, Output>;
export const plotSamplingFractionWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/plot-sampling-fraction-weight",
    title: "Plot Sampling Fraction Weight Tool",
    description:
      "Return area sampling fraction and inverse expansion weight under an explicit equal-inclusion area design assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampledArea: { type: "number", exclusiveMinimum: 0 },
        targetArea: { type: "number" },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["sampledArea", "targetArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        samplingFraction: { type: "number" },
        expansionWeight: { type: "number" },
      },
      required: ["eligibleArea", "samplingFraction", "expansionWeight"],
    },
    ports: {
      inputs: [
        {
          id: "sampledArea",
          label: "Sampled Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetArea",
          label: "Target Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          valueType: { type: "number" },
        },
        {
          id: "samplingFraction",
          label: "Sampling Fraction",
          valueType: { type: "number" },
        },
        {
          id: "expansionWeight",
          label: "Expansion Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plotSamplingFractionWeightTool.execute;
export default plotSamplingFractionWeightTool;
