import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: number;
  readonly right: number;
  readonly intersection: number;
  readonly tolerance: number;
};
export type Output = {
  readonly feasible: boolean;
  readonly minimum: number;
  readonly maximum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number", minimum: 0, maximum: 1 },
    right: { type: "number", minimum: 0, maximum: 1 },
    intersection: { type: "number" },
    tolerance: { type: "number" },
  },
  required: ["left", "right", "intersection", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feasible: { type: "boolean" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["feasible", "minimum", "maximum"],
} as const;
/** Compute joint probability rounding feasibility from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, intersection, tolerance } = input;
  const compute = (): Output => {
    probability(left);
    probability(right);
    domain(tolerance >= 0);
    const minimum = Math.max(0, left + right - 1),
      maximum = Math.min(left, right);
    return {
      feasible:
        intersection >= minimum - tolerance &&
        intersection <= maximum + tolerance,
      minimum,
      maximum,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 0.5, right: 0.5, intersection: 0.5, tolerance: 0 },
  output: { feasible: true, minimum: 0, maximum: 0.5 },
} satisfies ToolExample<Input, Output>;
export const jointProbabilityRoundingFeasibilityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/joint-probability-rounding-feasibility",
  title: "Joint Probability Rounding Feasibility Tool",
  description:
    "Compute joint probability rounding feasibility from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "intersection",
        label: "Intersection",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "tolerance",
        label: "Tolerance",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      { id: "minimum", label: "Minimum", valueType: { type: "number" } },
      { id: "maximum", label: "Maximum", valueType: { type: "number" } },
    ],
  },
});
export const run = jointProbabilityRoundingFeasibilityTool.execute;
export default jointProbabilityRoundingFeasibilityTool;
