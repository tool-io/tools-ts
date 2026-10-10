import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly actionWording: string;
  readonly completed: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    actionWording: { type: "string", maxLength: 8192, minLength: 1 },
    completed: { type: "boolean" },
  },
  required: ["recordId", "actionWording", "completed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit bedside action completion flag without prioritizing or recommending care. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, actionWording, completed } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && actionWording.length > 0, "recordId");
    return {
      label:
        recordId +
        "; " +
        JSON.stringify(actionWording) +
        " [" +
        (completed ? "recorded-complete" : "pending") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    actionWording: "recorded task A",
    completed: false,
  },
  output: { label: 'R17; "recorded task A" [pending]' },
} satisfies ToolExample<Input, Output>;
export const bedSidePendingActionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/bed-side-pending-action-label",
    title: "Bedside Pending Action Label",
    description:
      "Label an explicit bedside action completion flag without prioritizing or recommending care.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        actionWording: { type: "string", maxLength: 8192, minLength: 1 },
        completed: { type: "boolean" },
      },
      required: ["recordId", "actionWording", "completed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actionWording",
          label: "Action Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bedSidePendingActionLabelTool.execute;
export default bedSidePendingActionLabelTool;
