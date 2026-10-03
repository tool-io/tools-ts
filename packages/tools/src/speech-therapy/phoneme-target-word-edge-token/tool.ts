import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phonemes: readonly string[];
  readonly target: string;
};
export type Output = {
  readonly initialMatch: boolean;
  readonly finalMatch: boolean;
  readonly matchingPositions: readonly number[];
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
    target: { type: "string", maxLength: 8192 },
  },
  required: ["phonemes", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMatch: { type: "boolean" },
    finalMatch: { type: "boolean" },
    matchingPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["initialMatch", "finalMatch", "matchingPositions"],
} as const;
/** Inspect exact supplied phoneme tokens at word edges without phonetic transcription or clinical scoring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phonemes, target } = request;
  const compute = (): Output => {
    return {
      initialMatch: phonemes.length > 0 && phonemes[0] === target,
      finalMatch:
        phonemes.length > 0 && phonemes[phonemes.length - 1] === target,
      matchingPositions: phonemes.flatMap((x, i) => (x === target ? [i] : [])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phonemes: ["p", "a", "p"], target: "p" },
  output: { initialMatch: true, finalMatch: true, matchingPositions: [0, 2] },
} satisfies ToolExample<Input, Output>;
export const phonemeTargetWordEdgeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/phoneme-target-word-edge-token",
    title: "Phoneme Target Word Edge Token Tool",
    description:
      "Inspect exact supplied phoneme tokens at word edges without phonetic transcription or clinical scoring.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phonemes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        target: { type: "string", maxLength: 8192 },
      },
      required: ["phonemes", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMatch: { type: "boolean" },
        finalMatch: { type: "boolean" },
        matchingPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["initialMatch", "finalMatch", "matchingPositions"],
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
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "initialMatch",
          label: "Initial Match",
          valueType: { type: "boolean" },
        },
        {
          id: "finalMatch",
          label: "Final Match",
          valueType: { type: "boolean" },
        },
        {
          id: "matchingPositions",
          label: "Matching Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = phonemeTargetWordEdgeTokenTool.execute;
export default phonemeTargetWordEdgeTokenTool;
