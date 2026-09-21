import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalHours: number;
  readonly weights: readonly number[];
  readonly learner: number;
};
export type Output = {
  readonly allocatedHours: number;
  readonly weightShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalHours: { type: "number", minimum: 0 },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    learner: { type: "integer", minimum: 0 },
  },
  required: ["totalHours", "weights", "learner"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedHours: { type: "number" },
    weightShare: { type: "number" },
  },
  required: ["allocatedHours", "weightShare"],
} as const;
/** Calculate learner support hour allocation term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalHours, weights, learner } = request;
  const compute = (): Output => {
    H.domain(
      totalHours >= 0 &&
        weights.every((x) => x >= 0) &&
        weights.some((x) => x > 0),
    );
    H.integer(learner, 0, weights.length - 1);
    return {
      allocatedHours:
        (totalHours * weights[learner]) / weights.reduce((a, b) => a + b, 0),
      weightShare: weights[learner] / weights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalHours: 20, weights: [1, 2, 1], learner: 1 },
  output: { allocatedHours: 10, weightShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const learnerSupportHourAllocationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/learner-support-hour-allocation-term",
    title: "Learner Support Hour Allocation Term Tool",
    description:
      "Calculate learner support hour allocation term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalHours: { type: "number", minimum: 0 },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        learner: { type: "integer", minimum: 0 },
      },
      required: ["totalHours", "weights", "learner"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedHours: { type: "number" },
        weightShare: { type: "number" },
      },
      required: ["allocatedHours", "weightShare"],
    },
    ports: {
      inputs: [
        {
          id: "totalHours",
          label: "Total Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "learner",
          label: "Learner",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "allocatedHours",
          label: "Allocated Hours",
          valueType: { type: "number" },
        },
        {
          id: "weightShare",
          label: "Weight Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = learnerSupportHourAllocationTermTool.execute;
export default learnerSupportHourAllocationTermTool;
