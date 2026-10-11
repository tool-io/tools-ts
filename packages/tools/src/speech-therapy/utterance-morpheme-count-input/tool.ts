import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utteranceId: string;
  readonly suppliedMorphemeCounts: readonly number[];
};
export type Output = {
  readonly totalMorphemes: number;
  readonly countedWords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utteranceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMorphemeCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["utteranceId", "suppliedMorphemeCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMorphemes: { type: "integer" },
    countedWords: { type: "integer" },
  },
  required: ["totalMorphemes", "countedWords"],
} as const;
/** Sum explicitly supplied per-word morpheme counts without performing linguistic segmentation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utteranceId, suppliedMorphemeCounts } = request;
  const compute = (): Output => {
    H.domain(utteranceId.length > 0, "utteranceId");
    suppliedMorphemeCounts.forEach(
      (v) => (
        H.domain(
          Number.isSafeInteger(v) && v >= 0 && v <= Number.MAX_SAFE_INTEGER,
          "suppliedMorphemeCounts",
        ),
        v
      ),
    );
    return {
      totalMorphemes: suppliedMorphemeCounts.reduce((a, b) => a + b, 0),
      countedWords: suppliedMorphemeCounts.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { utteranceId: "U17", suppliedMorphemeCounts: [1, 2, 1] },
  output: { totalMorphemes: 4, countedWords: 3 },
} satisfies ToolExample<Input, Output>;
export const utteranceMorphemecountInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/utterance-morpheme-count-input",
    title: "Utterance Morpheme Count Input",
    description:
      "Sum explicitly supplied per-word morpheme counts without performing linguistic segmentation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utteranceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedMorphemeCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["utteranceId", "suppliedMorphemeCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMorphemes: { type: "integer" },
        countedWords: { type: "integer" },
      },
      required: ["totalMorphemes", "countedWords"],
    },
    ports: {
      inputs: [
        {
          id: "utteranceId",
          label: "Utterance Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMorphemeCounts",
          label: "Supplied Morpheme Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "totalMorphemes",
          label: "Total Morphemes",
          valueType: { type: "integer" },
        },
        {
          id: "countedWords",
          label: "Counted Words",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = utteranceMorphemecountInputTool.execute;
export default utteranceMorphemecountInputTool;
