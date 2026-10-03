import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phonemes: readonly string[];
  readonly targetIndex: number;
};
export type Output = {
  readonly phoneme: string;
  readonly position: string;
  readonly fromEnd: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phonemes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetIndex: { type: "integer", minimum: 0 },
  },
  required: ["phonemes", "targetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phoneme: { type: "string", maxLength: 8192 },
    position: { type: "string", maxLength: 8192 },
    fromEnd: { type: "integer" },
  },
  required: ["phoneme", "position", "fromEnd"],
} as const;
/** Locate a supplied phoneme token in an explicitly segmented word. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phonemes, targetIndex } = request;
  const compute = (): Output => {
    H.integer(targetIndex, 0, phonemes.length - 1);
    return {
      phoneme: phonemes[targetIndex],
      position:
        phonemes.length === 1
          ? "single"
          : targetIndex === 0
            ? "initial"
            : targetIndex === phonemes.length - 1
              ? "final"
              : "medial",
      fromEnd: phonemes.length - 1 - targetIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phonemes: ["k", "æ", "t"], targetIndex: 1 },
  output: { phoneme: "æ", position: "medial", fromEnd: 1 },
} satisfies ToolExample<Input, Output>;
export const phonemePositionInWordIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/phoneme-position-in-word-index",
    title: "Phoneme Position In Word Index Tool",
    description:
      "Locate a supplied phoneme token in an explicitly segmented word.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phonemes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targetIndex: { type: "integer", minimum: 0 },
      },
      required: ["phonemes", "targetIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phoneme: { type: "string", maxLength: 8192 },
        position: { type: "string", maxLength: 8192 },
        fromEnd: { type: "integer" },
      },
      required: ["phoneme", "position", "fromEnd"],
    },
    ports: {
      inputs: [
        {
          id: "phonemes",
          label: "Phonemes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targetIndex",
          label: "Target Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "phoneme", label: "Phoneme", valueType: { type: "string" } },
        { id: "position", label: "Position", valueType: { type: "string" } },
        { id: "fromEnd", label: "From End", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = phonemePositionInWordIndexTool.execute;
export default phonemePositionInWordIndexTool;
