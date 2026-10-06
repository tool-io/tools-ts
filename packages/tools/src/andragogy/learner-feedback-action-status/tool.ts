import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedbackId: string;
  readonly actionStatus: string;
};
export type Output = { readonly label: string; readonly closed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedbackId: { type: "string", maxLength: 8192, minLength: 1 },
    actionStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["unreviewed", "planned", "in-progress", "completed", "declined"],
    },
  },
  required: ["feedbackId", "actionStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    closed: { type: "boolean" },
  },
  required: ["label", "closed"],
} as const;
/** Render an explicit learner-feedback action status, distinguishing a declined action from a completed action. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedbackId, actionStatus } = request;
  const compute = (): Output => {
    H.domain(feedbackId.length > 0, "feedbackId");
    H.domain(
      [
        "unreviewed",
        "planned",
        "in-progress",
        "completed",
        "declined",
      ].includes(actionStatus),
      "actionStatus",
    );
    return {
      label: feedbackId + " [action: " + actionStatus + "]",
      closed: actionStatus === "completed" || actionStatus === "declined",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feedbackId: "F17", actionStatus: "in-progress" },
  output: { label: "F17 [action: in-progress]", closed: false },
} satisfies ToolExample<Input, Output>;
export const learnerfeedbackActionStatusTool = H.defineSchemaCalculation<
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
    id: "andragogy/learner-feedback-action-status",
    title: "Learner Feedback Action Status",
    description:
      "Render an explicit learner-feedback action status, distinguishing a declined action from a completed action.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedbackId: { type: "string", maxLength: 8192, minLength: 1 },
        actionStatus: {
          type: "string",
          maxLength: 8192,
          enum: [
            "unreviewed",
            "planned",
            "in-progress",
            "completed",
            "declined",
          ],
        },
      },
      required: ["feedbackId", "actionStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        closed: { type: "boolean" },
      },
      required: ["label", "closed"],
    },
    ports: {
      inputs: [
        {
          id: "feedbackId",
          label: "Feedback Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actionStatus",
          label: "Action Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "closed", label: "Closed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = learnerfeedbackActionStatusTool.execute;
export default learnerfeedbackActionStatusTool;
