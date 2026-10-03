import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mean: number;
  readonly totalWeight: number;
  readonly value: number;
  readonly weight: number;
};
export type Output = { readonly remainingMean: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mean: { type: "number" },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
    value: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["mean", "totalWeight", "value", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingMean: { type: "number" } },
  required: ["remainingMean"],
} as const;
/** Calculate weighted mean one observation deletion term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mean, totalWeight, value, weight } = input;
  const compute = (): Output => {
    H.positive(totalWeight);
    H.domain(weight >= 0 && weight < totalWeight);
    return {
      remainingMean:
        (mean * totalWeight - value * weight) / (totalWeight - weight),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mean: 5, totalWeight: 10, value: 8, weight: 2 },
  output: { remainingMean: 4.25 },
} satisfies ToolExample<Input, Output>;
export const weightedMeanOneObservationDeletionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/weighted-mean-one-observation-deletion-term",
      title: "Weighted Mean One Observation Deletion Term Tool",
      description:
        "Calculate weighted mean one observation deletion term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mean: { type: "number" },
          totalWeight: { type: "number", exclusiveMinimum: 0 },
          value: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: ["mean", "totalWeight", "value", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { remainingMean: { type: "number" } },
        required: ["remainingMean"],
      },
      ports: {
        inputs: [
          {
            id: "mean",
            label: "Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalWeight",
            label: "Total Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingMean",
            label: "Remaining Mean",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = weightedMeanOneObservationDeletionTermTool.execute;
export default weightedMeanOneObservationDeletionTermTool;
