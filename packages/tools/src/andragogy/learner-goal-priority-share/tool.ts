import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goalPriorityWeight: number;
  readonly totalPriorityWeight: number;
};
export type Output = { readonly priorityShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goalPriorityWeight: { type: "number", minimum: 0 },
    totalPriorityWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["goalPriorityWeight", "totalPriorityWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priorityShare: { type: "number" } },
  required: ["priorityShare"],
} as const;
/** Normalize one learner-assigned goal weight against a supplied compatible positive priority total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goalPriorityWeight, totalPriorityWeight } = request;
  const compute = (): Output => {
    (H.domain(totalPriorityWeight > 0, "totalPriorityWeight"),
      totalPriorityWeight);
    H.domain(
      goalPriorityWeight >= 0 && goalPriorityWeight <= totalPriorityWeight,
      "goalPriorityWeight",
    );
    return { priorityShare: goalPriorityWeight / totalPriorityWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goalPriorityWeight: 3, totalPriorityWeight: 12 },
  output: { priorityShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const learnergoalPriorityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/learner-goal-priority-share",
    title: "Learner Goal Priority Share",
    description:
      "Normalize one learner-assigned goal weight against a supplied compatible positive priority total.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goalPriorityWeight: { type: "number", minimum: 0 },
        totalPriorityWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["goalPriorityWeight", "totalPriorityWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { priorityShare: { type: "number" } },
      required: ["priorityShare"],
    },
    ports: {
      inputs: [
        {
          id: "goalPriorityWeight",
          label: "Goal Priority Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPriorityWeight",
          label: "Total Priority Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priorityShare",
          label: "Priority Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = learnergoalPriorityShareTool.execute;
export default learnergoalPriorityShareTool;
