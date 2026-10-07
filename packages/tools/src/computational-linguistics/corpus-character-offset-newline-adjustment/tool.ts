import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalOffset: number;
  readonly precedingExpandedNewlines: number;
};
export type Output = { readonly adjustedOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalOffset: { type: "integer", minimum: 0 },
    precedingExpandedNewlines: { type: "integer", minimum: 0 },
  },
  required: ["originalOffset", "precedingExpandedNewlines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedOffset: { type: "integer" } },
  required: ["adjustedOffset"],
} as const;
/** Adjust an explicit offset when each counted preceding LF becomes CRLF, adding one code unit per supplied preceding newline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalOffset, precedingExpandedNewlines } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(originalOffset) &&
        originalOffset >= 0 &&
        originalOffset <= Number.MAX_SAFE_INTEGER,
      "originalOffset",
    ),
      originalOffset);
    (H.domain(
      Number.isSafeInteger(precedingExpandedNewlines) &&
        precedingExpandedNewlines >= 0 &&
        precedingExpandedNewlines <= originalOffset,
      "precedingExpandedNewlines",
    ),
      precedingExpandedNewlines);
    return {
      adjustedOffset: Number(
        BigInt(originalOffset) + BigInt(precedingExpandedNewlines),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalOffset: 20, precedingExpandedNewlines: 3 },
  output: { adjustedOffset: 23 },
} satisfies ToolExample<Input, Output>;
export const corpusCharacterOffsetNewlineAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
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
      id: "computational-linguistics/corpus-character-offset-newline-adjustment",
      title: "Corpus Character Offset Newline Adjustment",
      description:
        "Adjust an explicit offset when each counted preceding LF becomes CRLF, adding one code unit per supplied preceding newline.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalOffset: { type: "integer", minimum: 0 },
          precedingExpandedNewlines: { type: "integer", minimum: 0 },
        },
        required: ["originalOffset", "precedingExpandedNewlines"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedOffset: { type: "integer" } },
        required: ["adjustedOffset"],
      },
      ports: {
        inputs: [
          {
            id: "originalOffset",
            label: "Original Offset",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "precedingExpandedNewlines",
            label: "Preceding Expanded Newlines",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "adjustedOffset",
            label: "Adjusted Offset",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = corpusCharacterOffsetNewlineAdjustmentTool.execute;
export default corpusCharacterOffsetNewlineAdjustmentTool;
