import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goalId: string;
  readonly userPriority: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
};
export type Output = {
  readonly label: string;
  readonly normalizedPosition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goalId: { type: "string", maxLength: 8192, minLength: 1 },
    userPriority: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
  },
  required: ["goalId", "userPriority", "scaleMinimum", "scaleMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    normalizedPosition: { type: "number" },
  },
  required: ["label", "normalizedPosition"],
} as const;
/** Record a user-supplied goal priority on explicit scale bounds without inferring urgency or a clinical priority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goalId, userPriority, scaleMinimum, scaleMaximum } = request;
  const compute = (): Output => {
    H.domain(goalId.length > 0, "goalId");
    H.domain(
      scaleMaximum > scaleMinimum &&
        userPriority >= scaleMinimum &&
        userPriority <= scaleMaximum,
      "scaleMaximum",
    );
    return {
      label: goalId + "; user priority=" + userPriority,
      normalizedPosition:
        (userPriority - scaleMinimum) / (scaleMaximum - scaleMinimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goalId: "G17", userPriority: 4, scaleMinimum: 1, scaleMaximum: 5 },
  output: { label: "G17; user priority=4", normalizedPosition: 0.75 },
} satisfies ToolExample<Input, Output>;
export const mentalHealthGoalUserPriorityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["psychiatry", "health and medicine"],
      keywords: ["psychiatry", "health and medicine"],
    },
    id: "psychiatry/mental-health-goal-user-priority",
    title: "Mental Health Goal User Priority",
    description:
      "Record a user-supplied goal priority on explicit scale bounds without inferring urgency or a clinical priority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goalId: { type: "string", maxLength: 8192, minLength: 1 },
        userPriority: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
      },
      required: ["goalId", "userPriority", "scaleMinimum", "scaleMaximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        normalizedPosition: { type: "number" },
      },
      required: ["label", "normalizedPosition"],
    },
    ports: {
      inputs: [
        {
          id: "goalId",
          label: "Goal Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "userPriority",
          label: "User Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMinimum",
          label: "Scale Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMaximum",
          label: "Scale Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "normalizedPosition",
          label: "Normalized Position",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mentalHealthGoalUserPriorityTool.execute;
export default mentalHealthGoalUserPriorityTool;
