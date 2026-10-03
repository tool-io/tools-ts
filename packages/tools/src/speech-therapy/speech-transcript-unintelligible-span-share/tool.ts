import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTokens: number;
  readonly unintelligibleTokens: number;
  readonly nonSpeechTokens: number;
  readonly overlappingUnintelligible: number;
};
export type Output = {
  readonly eligibleTokens: number;
  readonly eligibleUnintelligible: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTokens: { type: "integer", minimum: 1 },
    unintelligibleTokens: { type: "integer", minimum: 0 },
    nonSpeechTokens: { type: "integer", minimum: 0 },
    overlappingUnintelligible: { type: "integer", minimum: 0 },
  },
  required: [
    "totalTokens",
    "unintelligibleTokens",
    "nonSpeechTokens",
    "overlappingUnintelligible",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleTokens: { type: "integer" },
    eligibleUnintelligible: { type: "integer" },
    share: { type: "number" },
  },
  required: ["eligibleTokens", "eligibleUnintelligible", "share"],
} as const;
/** Calculate speech transcript unintelligible span share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    totalTokens,
    unintelligibleTokens,
    nonSpeechTokens,
    overlappingUnintelligible,
  } = request;
  const compute = (): Output => {
    H.integer(totalTokens, 1);
    H.integer(nonSpeechTokens, 0, totalTokens - 1);
    H.integer(unintelligibleTokens, 0, totalTokens);
    H.integer(
      overlappingUnintelligible,
      0,
      Math.min(unintelligibleTokens, nonSpeechTokens),
    );
    H.domain(
      unintelligibleTokens - overlappingUnintelligible <=
        totalTokens - nonSpeechTokens,
    );
    return {
      eligibleTokens: totalTokens - nonSpeechTokens,
      eligibleUnintelligible: unintelligibleTokens - overlappingUnintelligible,
      share:
        (unintelligibleTokens - overlappingUnintelligible) /
        (totalTokens - nonSpeechTokens),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalTokens: 100,
    unintelligibleTokens: 20,
    nonSpeechTokens: 10,
    overlappingUnintelligible: 5,
  },
  output: {
    eligibleTokens: 90,
    eligibleUnintelligible: 15,
    share: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const speechTranscriptUnintelligibleSpanShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "speech-therapy/speech-transcript-unintelligible-span-share",
      title: "Speech Transcript Unintelligible Span Share Tool",
      description:
        "Calculate speech transcript unintelligible span share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalTokens: { type: "integer", minimum: 1 },
          unintelligibleTokens: { type: "integer", minimum: 0 },
          nonSpeechTokens: { type: "integer", minimum: 0 },
          overlappingUnintelligible: { type: "integer", minimum: 0 },
        },
        required: [
          "totalTokens",
          "unintelligibleTokens",
          "nonSpeechTokens",
          "overlappingUnintelligible",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleTokens: { type: "integer" },
          eligibleUnintelligible: { type: "integer" },
          share: { type: "number" },
        },
        required: ["eligibleTokens", "eligibleUnintelligible", "share"],
      },
      ports: {
        inputs: [
          {
            id: "totalTokens",
            label: "Total Tokens",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unintelligibleTokens",
            label: "Unintelligible Tokens",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "nonSpeechTokens",
            label: "Non Speech Tokens",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "overlappingUnintelligible",
            label: "Overlapping Unintelligible",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "eligibleTokens",
            label: "Eligible Tokens",
            valueType: { type: "integer" },
          },
          {
            id: "eligibleUnintelligible",
            label: "Eligible Unintelligible",
            valueType: { type: "integer" },
          },
          { id: "share", label: "Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = speechTranscriptUnintelligibleSpanShareTool.execute;
export default speechTranscriptUnintelligibleSpanShareTool;
