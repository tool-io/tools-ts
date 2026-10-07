import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceIndex: number;
  readonly targetIndex: number;
  readonly inputIsOneBased: boolean;
};
export type Output = { readonly zeroBasedToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceIndex: { type: "integer", minimum: 0 },
    targetIndex: { type: "integer", minimum: 0 },
    inputIsOneBased: { type: "boolean" },
  },
  required: ["sourceIndex", "targetIndex", "inputIsOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zeroBasedToken: { type: "string", maxLength: 8192 } },
  required: ["zeroBasedToken"],
} as const;
/** Format one source-target word alignment pair in zero-based i-j notation from an explicit indexing convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceIndex, targetIndex, inputIsOneBased } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sourceIndex) &&
        sourceIndex >= (inputIsOneBased ? 1 : 0) &&
        sourceIndex <= Number.MAX_SAFE_INTEGER,
      "sourceIndex",
    ),
      sourceIndex);
    (H.domain(
      Number.isSafeInteger(targetIndex) &&
        targetIndex >= (inputIsOneBased ? 1 : 0) &&
        targetIndex <= Number.MAX_SAFE_INTEGER,
      "targetIndex",
    ),
      targetIndex);
    return {
      zeroBasedToken:
        sourceIndex -
        (inputIsOneBased ? 1 : 0) +
        "-" +
        (targetIndex - (inputIsOneBased ? 1 : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceIndex: 2, targetIndex: 5, inputIsOneBased: true },
  output: { zeroBasedToken: "1-4" },
} satisfies ToolExample<Input, Output>;
export const wordAlignmentPairTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/word-alignment-pair-token",
    title: "Word Alignment Pair Token",
    description:
      "Format one source-target word alignment pair in zero-based i-j notation from an explicit indexing convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceIndex: { type: "integer", minimum: 0 },
        targetIndex: { type: "integer", minimum: 0 },
        inputIsOneBased: { type: "boolean" },
      },
      required: ["sourceIndex", "targetIndex", "inputIsOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { zeroBasedToken: { type: "string", maxLength: 8192 } },
      required: ["zeroBasedToken"],
    },
    ports: {
      inputs: [
        {
          id: "sourceIndex",
          label: "Source Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inputIsOneBased",
          label: "Input Is One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "zeroBasedToken",
          label: "Zero Based Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = wordAlignmentPairTokenTool.execute;
export default wordAlignmentPairTokenTool;
