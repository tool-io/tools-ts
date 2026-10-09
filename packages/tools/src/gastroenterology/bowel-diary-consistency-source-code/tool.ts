import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly consistencyCode: string;
  readonly scaleSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    consistencyCode: { type: "string", maxLength: 8192, minLength: 1 },
    scaleSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "consistencyCode", "scaleSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a literal bowel-diary consistency code by its supplied scale source without classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, consistencyCode, scaleSource } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(consistencyCode.length > 0, "consistencyCode");
    H.domain(scaleSource.length > 0, "scaleSource");
    return { token: JSON.stringify([entryId, consistencyCode, scaleSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "D17", consistencyCode: "TYPE3", scaleSource: "Scale A" },
  output: { token: '["D17","TYPE3","Scale A"]' },
} satisfies ToolExample<Input, Output>;
export const bowelDiaryConsistencySourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/bowel-diary-consistency-source-code",
    title: "Bowel Diary Consistency Source Code",
    description:
      "Qualify a literal bowel-diary consistency code by its supplied scale source without classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        consistencyCode: { type: "string", maxLength: 8192, minLength: 1 },
        scaleSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entryId", "consistencyCode", "scaleSource"],
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
          id: "consistencyCode",
          label: "Consistency Code",
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
export const run = bowelDiaryConsistencySourceCodeTool.execute;
export default bowelDiaryConsistencySourceCodeTool;
