import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldNoteId: string;
  readonly interviewId: string;
  readonly turnCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldNoteId: { type: "string", maxLength: 8192, minLength: 1 },
    interviewId: { type: "string", maxLength: 8192, minLength: 1 },
    turnCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fieldNoteId", "interviewId", "turnCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit field-note interview-turn key without identifying speakers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldNoteId, interviewId, turnCode } = request;
  const compute = (): Output => {
    H.domain(fieldNoteId.length > 0, "fieldNoteId");
    H.domain(interviewId.length > 0, "interviewId");
    H.domain(turnCode.length > 0, "turnCode");
    return { token: JSON.stringify([fieldNoteId, interviewId, turnCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldNoteId: "NOTE17", interviewId: "INT2", turnCode: "TURN3" },
  output: { token: '["NOTE17","INT2","TURN3"]' },
} satisfies ToolExample<Input, Output>;
export const fieldNoteInterviewTurnIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["anthropology", "social sciences"],
      keywords: ["anthropology", "social sciences"],
    },
    id: "anthropology/field-note-interview-turn-id",
    title: "Field Note Interview Turn ID",
    description:
      "Build an unambiguous explicit field-note interview-turn key without identifying speakers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldNoteId: { type: "string", maxLength: 8192, minLength: 1 },
        interviewId: { type: "string", maxLength: 8192, minLength: 1 },
        turnCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fieldNoteId", "interviewId", "turnCode"],
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
          id: "fieldNoteId",
          label: "Field Note Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "interviewId",
          label: "Interview Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "turnCode",
          label: "Turn Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldNoteInterviewTurnIdTool.execute;
export default fieldNoteInterviewTurnIdTool;
