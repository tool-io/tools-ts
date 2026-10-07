import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rangeToken: string };
export type Output = {
  readonly startId: number;
  readonly endId: number;
  readonly coveredWordCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rangeToken: { type: "string", maxLength: 8192 } },
  required: ["rangeToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startId: { type: "integer" },
    endId: { type: "integer" },
    coveredWordCount: { type: "integer" },
  },
  required: ["startId", "endId", "coveredWordCount"],
} as const;
/** Parse a CoNLL-U multiword-token range into positive inclusive word-ID endpoints without validating a sentence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rangeToken } = request;
  const compute = (): Output => {
    return (() => {
      const match = /^([1-9][0-9]*)-([1-9][0-9]*)(?![\s\S])/.exec(rangeToken);
      H.domain(match !== null, "rangeToken");
      const startId = Number(match[1]),
        endId = Number(match[2]);
      H.domain(
        Number.isSafeInteger(startId) &&
          Number.isSafeInteger(endId) &&
          endId > startId,
        "rangeToken",
      );
      return { startId, endId, coveredWordCount: endId - startId + 1 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rangeToken: "3-5" },
  output: { startId: 3, endId: 5, coveredWordCount: 3 },
} satisfies ToolExample<Input, Output>;
export const conlluRangeTokenBoundaryTool = H.defineSchemaCalculation<
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
    id: "computational-linguistics/conllu-range-token-boundary",
    title: "CoNLL-U Range Token Boundary",
    description:
      "Parse a CoNLL-U multiword-token range into positive inclusive word-ID endpoints without validating a sentence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rangeToken: { type: "string", maxLength: 8192 } },
      required: ["rangeToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startId: { type: "integer" },
        endId: { type: "integer" },
        coveredWordCount: { type: "integer" },
      },
      required: ["startId", "endId", "coveredWordCount"],
    },
    ports: {
      inputs: [
        {
          id: "rangeToken",
          label: "Range Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "startId", label: "Start Id", valueType: { type: "integer" } },
        { id: "endId", label: "End Id", valueType: { type: "integer" } },
        {
          id: "coveredWordCount",
          label: "Covered Word Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = conlluRangeTokenBoundaryTool.execute;
export default conlluRangeTokenBoundaryTool;
