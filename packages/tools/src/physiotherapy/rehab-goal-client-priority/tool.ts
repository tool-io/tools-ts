import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goalId: string;
  readonly clientRating: number;
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
    clientRating: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
  },
  required: ["goalId", "clientRating", "scaleMinimum", "scaleMaximum"],
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
/** Record an explicit client-assigned goal rating on supplied bounds without prioritizing clinical care. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goalId, clientRating, scaleMinimum, scaleMaximum } = request;
  const compute = (): Output => {
    H.domain(goalId.length > 0, "goalId");
    H.domain(
      scaleMaximum > scaleMinimum &&
        clientRating >= scaleMinimum &&
        clientRating <= scaleMaximum,
      "scaleMaximum",
    );
    return {
      label: goalId + "; client priority=" + clientRating,
      normalizedPosition:
        (clientRating - scaleMinimum) / (scaleMaximum - scaleMinimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goalId: "G17", clientRating: 4, scaleMinimum: 1, scaleMaximum: 5 },
  output: { label: "G17; client priority=4", normalizedPosition: 0.75 },
} satisfies ToolExample<Input, Output>;
export const rehabGoalClientPriorityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/rehab-goal-client-priority",
    title: "Rehab Goal Client Priority",
    description:
      "Record an explicit client-assigned goal rating on supplied bounds without prioritizing clinical care.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goalId: { type: "string", maxLength: 8192, minLength: 1 },
        clientRating: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
      },
      required: ["goalId", "clientRating", "scaleMinimum", "scaleMaximum"],
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
          id: "clientRating",
          label: "Client Rating",
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
export const run = rehabGoalClientPriorityTool.execute;
export default rehabGoalClientPriorityTool;
