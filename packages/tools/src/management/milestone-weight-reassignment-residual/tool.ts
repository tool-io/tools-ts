import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldWeights: readonly number[];
  readonly newWeights: readonly number[];
};
export type Output = {
  readonly oldTotal: number;
  readonly newTotal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    newWeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["oldWeights", "newWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldTotal: { type: "number" },
    newTotal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["oldTotal", "newTotal", "residual"],
} as const;
/** Calculate milestone weight reassignment residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldWeights, newWeights } = request;
  const compute = (): Output => {
    H.sameLength(oldWeights, newWeights);
    H.domain(
      oldWeights.every((x) => x >= 0) && newWeights.every((x) => x >= 0),
    );
    return {
      oldTotal: oldWeights.reduce((a, b) => a + b, 0),
      newTotal: newWeights.reduce((a, b) => a + b, 0),
      residual:
        newWeights.reduce((a, b) => a + b, 0) -
        oldWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldWeights: [0.2, 0.8], newWeights: [0.4, 0.6] },
  output: { oldTotal: 1, newTotal: 1, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const milestoneWeightReassignmentResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/milestone-weight-reassignment-residual",
      title: "Milestone Weight Reassignment Residual Tool",
      description:
        "Calculate milestone weight reassignment residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          newWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["oldWeights", "newWeights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldTotal: { type: "number" },
          newTotal: { type: "number" },
          residual: { type: "number" },
        },
        required: ["oldTotal", "newTotal", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "oldWeights",
            label: "Old Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "newWeights",
            label: "New Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "oldTotal", label: "Old Total", valueType: { type: "number" } },
          { id: "newTotal", label: "New Total", valueType: { type: "number" } },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = milestoneWeightReassignmentResidualTool.execute;
export default milestoneWeightReassignmentResidualTool;
