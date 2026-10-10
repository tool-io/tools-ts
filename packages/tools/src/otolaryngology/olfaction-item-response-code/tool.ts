import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly recordedCode: string;
  readonly correctCode: string;
  readonly missingCode: string;
};
export type Output = {
  readonly recordedCorrect: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192 },
    correctCode: { type: "string", maxLength: 8192 },
    missingCode: { type: "string", maxLength: 8192 },
  },
  required: ["itemId", "recordedCode", "correctCode", "missingCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCorrect: { type: "boolean" },
    missing: { type: "boolean" },
  },
  required: ["recordedCorrect", "missing"],
} as const;
/** Compare a literal olfaction item response with an explicitly supplied answer and missing code without interpreting test performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, recordedCode, correctCode, missingCode } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0 && correctCode !== missingCode, "itemId");
    return {
      recordedCorrect: recordedCode === correctCode,
      missing: recordedCode === missingCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "Q17",
    recordedCode: "A",
    correctCode: "A",
    missingCode: "NA",
  },
  output: { recordedCorrect: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const olfactionItemResponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/olfaction-item-response-code",
    title: "Olfaction Item Response Code",
    description:
      "Compare a literal olfaction item response with an explicitly supplied answer and missing code without interpreting test performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192 },
        correctCode: { type: "string", maxLength: 8192 },
        missingCode: { type: "string", maxLength: 8192 },
      },
      required: ["itemId", "recordedCode", "correctCode", "missingCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCorrect: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["recordedCorrect", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
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
          id: "correctCode",
          label: "Correct Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recordedCorrect",
          label: "Recorded Correct",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = olfactionItemResponseCodeTool.execute;
export default olfactionItemResponseCodeTool;
