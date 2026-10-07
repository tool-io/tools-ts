import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pauseSeconds: number;
  readonly wordSeconds: number;
};
export type Output = {
  readonly pauseToWordRatio: number;
  readonly pauseShareOfTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pauseSeconds: { type: "number", minimum: 0 },
    wordSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pauseSeconds", "wordSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pauseToWordRatio: { type: "number" },
    pauseShareOfTotal: { type: "number" },
  },
  required: ["pauseToWordRatio", "pauseShareOfTotal"],
} as const;
/** Compare explicit pause and word durations on the same time basis without evaluating speech fluency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pauseSeconds, wordSeconds } = request;
  const compute = (): Output => {
    H.domain(pauseSeconds >= 0, "pauseSeconds");
    (H.domain(Number.isFinite(wordSeconds) && wordSeconds > 0, "wordSeconds"),
      wordSeconds);
    return {
      pauseToWordRatio: pauseSeconds / wordSeconds,
      pauseShareOfTotal: pauseSeconds / (pauseSeconds + wordSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pauseSeconds: 10, wordSeconds: 40 },
  output: { pauseToWordRatio: 0.25, pauseShareOfTotal: 0.2 },
} satisfies ToolExample<Input, Output>;
export const speechPauseToWordTimeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/speech-pause-to-word-time-ratio",
    title: "Speech Pause To Word Time Ratio",
    description:
      "Compare explicit pause and word durations on the same time basis without evaluating speech fluency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pauseSeconds: { type: "number", minimum: 0 },
        wordSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pauseSeconds", "wordSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pauseToWordRatio: { type: "number" },
        pauseShareOfTotal: { type: "number" },
      },
      required: ["pauseToWordRatio", "pauseShareOfTotal"],
    },
    ports: {
      inputs: [
        {
          id: "pauseSeconds",
          label: "Pause Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wordSeconds",
          label: "Word Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pauseToWordRatio",
          label: "Pause To Word Ratio",
          valueType: { type: "number" },
        },
        {
          id: "pauseShareOfTotal",
          label: "Pause Share Of Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechPauseToWordTimeRatioTool.execute;
export default speechPauseToWordTimeRatioTool;
