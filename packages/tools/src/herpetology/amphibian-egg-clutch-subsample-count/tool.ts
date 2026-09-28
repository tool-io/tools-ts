import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countedEggs: number;
  readonly subsampleVolume: number;
  readonly totalVolume: number;
  readonly emptyFraction: number;
};
export type Output = {
  readonly expandedCount: number;
  readonly effectiveVolume: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedEggs: { type: "integer", minimum: 0 },
    subsampleVolume: { type: "number", exclusiveMinimum: 0 },
    totalVolume: { type: "number" },
    emptyFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["countedEggs", "subsampleVolume", "totalVolume", "emptyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedCount: { type: "number" },
    effectiveVolume: { type: "number" },
    density: { type: "number" },
  },
  required: ["expandedCount", "effectiveVolume", "density"],
} as const;
/** Homogeneous volumetric clutch subsampling with the same void fraction in subsample and total; no individual viability is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countedEggs, subsampleVolume, totalVolume, emptyFraction } = request;
  const compute = (): Output => {
    H.integer(countedEggs, 0);
    H.positive(subsampleVolume);
    H.domain(
      totalVolume >= subsampleVolume && emptyFraction >= 0 && emptyFraction < 1,
    );
    return {
      expandedCount: (countedEggs * totalVolume) / subsampleVolume,
      effectiveVolume: totalVolume * (1 - emptyFraction),
      density: countedEggs / (subsampleVolume * (1 - emptyFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    countedEggs: 40,
    subsampleVolume: 10,
    totalVolume: 100,
    emptyFraction: 0.2,
  },
  output: { expandedCount: 400, effectiveVolume: 80, density: 5 },
} satisfies ToolExample<Input, Output>;
export const amphibianEggClutchSubsampleCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/amphibian-egg-clutch-subsample-count",
    title: "Amphibian Egg Clutch Subsample Count Tool",
    description:
      "Homogeneous volumetric clutch subsampling with the same void fraction in subsample and total; no individual viability is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedEggs: { type: "integer", minimum: 0 },
        subsampleVolume: { type: "number", exclusiveMinimum: 0 },
        totalVolume: { type: "number" },
        emptyFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: [
        "countedEggs",
        "subsampleVolume",
        "totalVolume",
        "emptyFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedCount: { type: "number" },
        effectiveVolume: { type: "number" },
        density: { type: "number" },
      },
      required: ["expandedCount", "effectiveVolume", "density"],
    },
    ports: {
      inputs: [
        {
          id: "countedEggs",
          label: "Counted Eggs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subsampleVolume",
          label: "Subsample Volume",
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
          id: "emptyFraction",
          label: "Empty Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expandedCount",
          label: "Expanded Count",
          valueType: { type: "number" },
        },
        {
          id: "effectiveVolume",
          label: "Effective Volume",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = amphibianEggClutchSubsampleCountTool.execute;
export default amphibianEggClutchSubsampleCountTool;
