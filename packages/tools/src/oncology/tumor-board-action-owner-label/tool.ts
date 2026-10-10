import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meetingId: string;
  readonly actionId: string;
  readonly recordedOwner: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meetingId: { type: "string", maxLength: 8192, minLength: 1 },
    actionId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedOwner: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["meetingId", "actionId", "recordedOwner"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit tumor-board action owner without generating recommendations or assigning responsibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meetingId, actionId, recordedOwner } = request;
  const compute = (): Output => {
    H.domain(meetingId.length > 0, "meetingId");
    H.domain(actionId.length > 0, "actionId");
    H.domain(recordedOwner.length > 0, "recordedOwner");
    return { token: JSON.stringify([meetingId, actionId, recordedOwner]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meetingId: "TB17", actionId: "ACTION3", recordedOwner: "Team A" },
  output: { token: '["TB17","ACTION3","Team A"]' },
} satisfies ToolExample<Input, Output>;
export const tumorBoardActionOwnerLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/tumor-board-action-owner-label",
    title: "Tumor Board Action Owner Label",
    description:
      "Record an explicit tumor-board action owner without generating recommendations or assigning responsibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meetingId: { type: "string", maxLength: 8192, minLength: 1 },
        actionId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedOwner: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["meetingId", "actionId", "recordedOwner"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "meetingId",
          label: "Meeting Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actionId",
          label: "Action Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedOwner",
          label: "Recorded Owner",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tumorBoardActionOwnerLabelTool.execute;
export default tumorBoardActionOwnerLabelTool;
