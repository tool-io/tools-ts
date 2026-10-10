import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly recordedCode: string;
  readonly codebookSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "recordedCode", "codebookSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied neurological item response code and source without scoring or diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, recordedCode, codebookSource } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(recordedCode.length > 0, "recordedCode");
    H.domain(codebookSource.length > 0, "codebookSource");
    return { token: JSON.stringify([itemId, recordedCode, codebookSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "N17",
    recordedCode: "CODE-A",
    codebookSource: "Scale A v2",
  },
  output: { token: '["N17","CODE-A","Scale A v2"]' },
} satisfies ToolExample<Input, Output>;
export const neurologicalItemSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/neurological-item-source-code",
    title: "Neurological Item Source Code",
    description:
      "Record a supplied neurological item response code and source without scoring or diagnostic interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "recordedCode", "codebookSource"],
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
          id: "codebookSource",
          label: "Codebook Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = neurologicalItemSourceCodeTool.execute;
export default neurologicalItemSourceCodeTool;
