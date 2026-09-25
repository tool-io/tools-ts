import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly difference: number;
  readonly weight: number;
  readonly distance: number;
};
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    weight: { type: "number" },
    distance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["difference", "weight", "distance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "number" } },
  required: ["gradient"],
} as const;
/** Compute weighted euclidean one axis gradient from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { difference, weight, distance } = input;
  const compute = (): Output => {
    domain(weight >= 0);
    positive(distance);
    return { gradient: (weight * difference) / distance };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { difference: 3, weight: 2, distance: 6 },
  output: { gradient: 1 },
} satisfies ToolExample<Input, Output>;
export const weightedEuclideanOneAxisGradientTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/weighted-euclidean-one-axis-gradient",
  title: "Weighted Euclidean One Axis Gradient Tool",
  description:
    "Compute weighted euclidean one axis gradient from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "difference",
        label: "Difference",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "weight",
        label: "Weight",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "distance",
        label: "Distance",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "gradient", label: "Gradient", valueType: { type: "number" } },
    ],
  },
});
export const run = weightedEuclideanOneAxisGradientTool.execute;
export default weightedEuclideanOneAxisGradientTool;
