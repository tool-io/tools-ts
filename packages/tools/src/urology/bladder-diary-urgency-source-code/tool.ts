import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly recordedCode: string;
  readonly scaleSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
    scaleSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "recordedCode", "scaleSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied bladder-diary urgency code by its source without classifying urgency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, recordedCode, scaleSource } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(recordedCode.length > 0, "recordedCode");
    H.domain(scaleSource.length > 0, "scaleSource");
    return { token: JSON.stringify([entryId, recordedCode, scaleSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "D17", recordedCode: "U2", scaleSource: "Diary scale A" },
  output: { token: '["D17","U2","Diary scale A"]' },
} satisfies ToolExample<Input, Output>;
export const bladderDiaryUrgencySourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/bladder-diary-urgency-source-code",
    title: "Bladder Diary Urgency Source Code",
    description:
      "Qualify a supplied bladder-diary urgency code by its source without classifying urgency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
        scaleSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entryId", "recordedCode", "scaleSource"],
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
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scaleSource",
          label: "Scale Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bladderDiaryUrgencySourceCodeTool.execute;
export default bladderDiaryUrgencySourceCodeTool;
