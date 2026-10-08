import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personRecordCode: string;
  readonly occupationWording: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personRecordCode: { type: "string", maxLength: 8192, minLength: 1 },
    occupationWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["personRecordCode", "occupationWording", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve literal historical occupation wording and a source identifier without classifying social status or modern occupation codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personRecordCode, occupationWording, sourceId } = request;
  const compute = (): Output => {
    H.domain(
      personRecordCode.length > 0 &&
        occupationWording.length > 0 &&
        sourceId.length > 0,
      "personRecordCode",
    );
    return {
      token: JSON.stringify([personRecordCode, occupationWording, sourceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personRecordCode: "P17",
    occupationWording: "recorded occupation",
    sourceId: "S3",
  },
  output: { token: '["P17","recorded occupation","S3"]' },
} satisfies ToolExample<Input, Output>;
export const historicalOccupationSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economic-history", "economic history", "economics"],
      keywords: ["economic history", "economics"],
    },
    id: "economic-history/historical-occupation-source-code",
    title: "Historical Occupation Source Code",
    description:
      "Preserve literal historical occupation wording and a source identifier without classifying social status or modern occupation codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personRecordCode: { type: "string", maxLength: 8192, minLength: 1 },
        occupationWording: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["personRecordCode", "occupationWording", "sourceId"],
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
          id: "personRecordCode",
          label: "Person Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "occupationWording",
          label: "Occupation Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalOccupationSourceCodeTool.execute;
export default historicalOccupationSourceCodeTool;
