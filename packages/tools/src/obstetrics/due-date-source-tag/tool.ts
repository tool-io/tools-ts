import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pregnancyRecordId: string;
  readonly dueDateText: string;
  readonly datingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pregnancyRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    dueDateText: { type: "string", maxLength: 8192, minLength: 1 },
    datingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["pregnancyRecordId", "dueDateText", "datingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit due-date text and its dating source without estimating or adjudicating a due date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pregnancyRecordId, dueDateText, datingSource } = request;
  const compute = (): Output => {
    H.domain(pregnancyRecordId.length > 0, "pregnancyRecordId");
    H.domain(dueDateText.length > 0, "dueDateText");
    H.domain(datingSource.length > 0, "datingSource");
    return {
      token: JSON.stringify([pregnancyRecordId, dueDateText, datingSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pregnancyRecordId: "P17",
    dueDateText: "2027-01-15",
    datingSource: "Recorded estimate A",
  },
  output: { token: '["P17","2027-01-15","Recorded estimate A"]' },
} satisfies ToolExample<Input, Output>;
export const dueDateSourceTagTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/due-date-source-tag",
    title: "Due Date Source Tag",
    description:
      "Record explicit due-date text and its dating source without estimating or adjudicating a due date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pregnancyRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        dueDateText: { type: "string", maxLength: 8192, minLength: 1 },
        datingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["pregnancyRecordId", "dueDateText", "datingSource"],
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
          id: "pregnancyRecordId",
          label: "Pregnancy Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dueDateText",
          label: "Due Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "datingSource",
          label: "Dating Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dueDateSourceTagTool.execute;
export default dueDateSourceTagTool;
