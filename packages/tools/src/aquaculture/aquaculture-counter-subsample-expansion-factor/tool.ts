import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counted: number;
  readonly sampledVolume: number;
  readonly totalVolume: number;
  readonly replicateFraction: number;
};
export type Output = {
  readonly expansionFactor: number;
  readonly estimatedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counted: { type: "integer", minimum: 0 },
    sampledVolume: { type: "number", exclusiveMinimum: 0 },
    totalVolume: { type: "number" },
    replicateFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["counted", "sampledVolume", "totalVolume", "replicateFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expansionFactor: { type: "number" },
    estimatedCount: { type: "number" },
  },
  required: ["expansionFactor", "estimatedCount"],
} as const;
/** Expand a count observed in an explicit fraction of a representative volume sample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counted, sampledVolume, totalVolume, replicateFraction } = request;
  const compute = (): Output => {
    H.integer(counted, 0);
    H.positive(sampledVolume);
    H.domain(
      totalVolume >= sampledVolume &&
        replicateFraction > 0 &&
        replicateFraction <= 1,
    );
    return {
      expansionFactor: totalVolume / (sampledVolume * replicateFraction),
      estimatedCount:
        (counted * totalVolume) / (sampledVolume * replicateFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counted: 40,
    sampledVolume: 2,
    totalVolume: 100,
    replicateFraction: 0.5,
  },
  output: { expansionFactor: 100, estimatedCount: 4000 },
} satisfies ToolExample<Input, Output>;
export const aquacultureCounterSubsampleExpansionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaculture/aquaculture-counter-subsample-expansion-factor",
      title: "Aquaculture Counter Subsample Expansion Factor Tool",
      description:
        "Expand a count observed in an explicit fraction of a representative volume sample.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counted: { type: "integer", minimum: 0 },
          sampledVolume: { type: "number", exclusiveMinimum: 0 },
          totalVolume: { type: "number" },
          replicateFraction: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: [
          "counted",
          "sampledVolume",
          "totalVolume",
          "replicateFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expansionFactor: { type: "number" },
          estimatedCount: { type: "number" },
        },
        required: ["expansionFactor", "estimatedCount"],
      },
      ports: {
        inputs: [
          {
            id: "counted",
            label: "Counted",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sampledVolume",
            label: "Sampled Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalVolume",
            label: "Total Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "replicateFraction",
            label: "Replicate Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expansionFactor",
            label: "Expansion Factor",
            valueType: { type: "number" },
          },
          {
            id: "estimatedCount",
            label: "Estimated Count",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquacultureCounterSubsampleExpansionFactorTool.execute;
export default aquacultureCounterSubsampleExpansionFactorTool;
