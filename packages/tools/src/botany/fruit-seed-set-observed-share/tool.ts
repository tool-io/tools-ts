import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowers: number;
  readonly fruits: number;
  readonly sampledFruits: number;
  readonly observedSeeds: number;
  readonly ovulesPerFruit: number;
};
export type Output = {
  readonly fruitSet: number;
  readonly meanSeedsPerSampledFruit: number;
  readonly observedSeedSet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowers: { type: "integer", minimum: 1 },
    fruits: { type: "integer", minimum: 1 },
    sampledFruits: { type: "integer", minimum: 1 },
    observedSeeds: { type: "integer", minimum: 0 },
    ovulesPerFruit: { type: "integer", minimum: 1 },
  },
  required: [
    "flowers",
    "fruits",
    "sampledFruits",
    "observedSeeds",
    "ovulesPerFruit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fruitSet: { type: "number" },
    meanSeedsPerSampledFruit: { type: "number" },
    observedSeedSet: { type: "number" },
  },
  required: ["fruitSet", "meanSeedsPerSampledFruit", "observedSeedSet"],
} as const;
/** Calculate fruit seed set observed share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowers, fruits, sampledFruits, observedSeeds, ovulesPerFruit } =
    request;
  const compute = (): Output => {
    H.integer(flowers, 1);
    H.integer(fruits, 1, flowers);
    H.integer(sampledFruits, 1, fruits);
    H.integer(ovulesPerFruit, 1);
    H.integer(observedSeeds, 0, sampledFruits * ovulesPerFruit);
    return {
      fruitSet: fruits / flowers,
      meanSeedsPerSampledFruit: observedSeeds / sampledFruits,
      observedSeedSet: observedSeeds / (sampledFruits * ovulesPerFruit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowers: 100,
    fruits: 60,
    sampledFruits: 10,
    observedSeeds: 80,
    ovulesPerFruit: 10,
  },
  output: { fruitSet: 0.6, meanSeedsPerSampledFruit: 8, observedSeedSet: 0.8 },
} satisfies ToolExample<Input, Output>;
export const fruitSeedSetObservedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/fruit-seed-set-observed-share",
    title: "Fruit Seed Set Observed Share Tool",
    description:
      "Calculate fruit seed set observed share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowers: { type: "integer", minimum: 1 },
        fruits: { type: "integer", minimum: 1 },
        sampledFruits: { type: "integer", minimum: 1 },
        observedSeeds: { type: "integer", minimum: 0 },
        ovulesPerFruit: { type: "integer", minimum: 1 },
      },
      required: [
        "flowers",
        "fruits",
        "sampledFruits",
        "observedSeeds",
        "ovulesPerFruit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fruitSet: { type: "number" },
        meanSeedsPerSampledFruit: { type: "number" },
        observedSeedSet: { type: "number" },
      },
      required: ["fruitSet", "meanSeedsPerSampledFruit", "observedSeedSet"],
    },
    ports: {
      inputs: [
        {
          id: "flowers",
          label: "Flowers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fruits",
          label: "Fruits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampledFruits",
          label: "Sampled Fruits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedSeeds",
          label: "Observed Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ovulesPerFruit",
          label: "Ovules Per Fruit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "fruitSet", label: "Fruit Set", valueType: { type: "number" } },
        {
          id: "meanSeedsPerSampledFruit",
          label: "Mean Seeds Per Sampled Fruit",
          valueType: { type: "number" },
        },
        {
          id: "observedSeedSet",
          label: "Observed Seed Set",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fruitSeedSetObservedShareTool.execute;
export default fruitSeedSetObservedShareTool;
