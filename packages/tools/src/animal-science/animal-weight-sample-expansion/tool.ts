import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleWeights: readonly number[];
  readonly totalAnimals: number;
};
export type Output = {
  readonly sampleMean: number;
  readonly expandedWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    totalAnimals: { type: "integer", minimum: 0 },
  },
  required: ["sampleWeights", "totalAnimals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMean: { type: "number" },
    expandedWeight: { type: "number" },
  },
  required: ["sampleMean", "expandedWeight"],
} as const;
/** Expand a supplied representative weight sample without species norms or growth prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleWeights, totalAnimals } = request;
  const compute = (): Output => {
    H.integer(totalAnimals, 0);
    H.domain(
      sampleWeights.length > 0 &&
        sampleWeights.every((x) => x >= 0) &&
        totalAnimals >= sampleWeights.length,
    );
    return {
      sampleMean:
        sampleWeights.reduce((a, b) => a + b, 0) / sampleWeights.length,
      expandedWeight:
        (sampleWeights.reduce((a, b) => a + b, 0) / sampleWeights.length) *
        totalAnimals,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleWeights: [10, 12, 14], totalAnimals: 30 },
  output: { sampleMean: 12, expandedWeight: 360 },
} satisfies ToolExample<Input, Output>;
export const animalWeightSampleExpansionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/animal-weight-sample-expansion",
    title: "Animal Weight Sample Expansion Tool",
    description:
      "Expand a supplied representative weight sample without species norms or growth prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        totalAnimals: { type: "integer", minimum: 0 },
      },
      required: ["sampleWeights", "totalAnimals"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleMean: { type: "number" },
        expandedWeight: { type: "number" },
      },
      required: ["sampleMean", "expandedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "sampleWeights",
          label: "Sample Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "totalAnimals",
          label: "Total Animals",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sampleMean",
          label: "Sample Mean",
          valueType: { type: "number" },
        },
        {
          id: "expandedWeight",
          label: "Expanded Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalWeightSampleExpansionTool.execute;
export default animalWeightSampleExpansionTool;
