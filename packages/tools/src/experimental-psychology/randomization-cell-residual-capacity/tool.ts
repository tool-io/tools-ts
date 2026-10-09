import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetAssignments: number;
  readonly existingAssignments: number;
};
export type Output = {
  readonly remainingCapacity: number;
  readonly fullOrOverfilled: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetAssignments: { type: "integer", minimum: 0 },
    existingAssignments: { type: "integer", minimum: 0 },
  },
  required: ["targetAssignments", "existingAssignments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingCapacity: { type: "integer" },
    fullOrOverfilled: { type: "boolean" },
  },
  required: ["remainingCapacity", "fullOrOverfilled"],
} as const;
/** Reconcile explicit randomization-cell target and existing assignment counts without performing randomization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetAssignments, existingAssignments } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(targetAssignments) &&
        targetAssignments >= 0 &&
        targetAssignments <= Number.MAX_SAFE_INTEGER,
      "targetAssignments",
    ),
      targetAssignments);
    (H.domain(
      Number.isSafeInteger(existingAssignments) &&
        existingAssignments >= 0 &&
        existingAssignments <= Number.MAX_SAFE_INTEGER,
      "existingAssignments",
    ),
      existingAssignments);
    return {
      remainingCapacity: targetAssignments - existingAssignments,
      fullOrOverfilled: existingAssignments >= targetAssignments,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetAssignments: 20, existingAssignments: 12 },
  output: { remainingCapacity: 8, fullOrOverfilled: false },
} satisfies ToolExample<Input, Output>;
export const randomizationCellResidualCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/randomization-cell-residual-capacity",
    title: "Randomization Cell Residual Capacity Tool",
    description:
      "Reconcile explicit randomization-cell target and existing assignment counts without performing randomization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetAssignments: { type: "integer", minimum: 0 },
        existingAssignments: { type: "integer", minimum: 0 },
      },
      required: ["targetAssignments", "existingAssignments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingCapacity: { type: "integer" },
        fullOrOverfilled: { type: "boolean" },
      },
      required: ["remainingCapacity", "fullOrOverfilled"],
    },
    ports: {
      inputs: [
        {
          id: "targetAssignments",
          label: "Target Assignments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "existingAssignments",
          label: "Existing Assignments",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingCapacity",
          label: "Remaining Capacity",
          valueType: { type: "integer" },
        },
        {
          id: "fullOrOverfilled",
          label: "Full Or Overfilled",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = randomizationCellResidualCapacityTool.execute;
export default randomizationCellResidualCapacityTool;
