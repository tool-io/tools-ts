import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promptTimestampSeconds: number;
  readonly responseTimestampSeconds: number;
};
export type Output = {
  readonly lagSeconds: number;
  readonly precedesPrompt: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promptTimestampSeconds: { type: "number" },
    responseTimestampSeconds: { type: "number" },
  },
  required: ["promptTimestampSeconds", "responseTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagSeconds: { type: "number" },
    precedesPrompt: { type: "boolean" },
  },
  required: ["lagSeconds", "precedesPrompt"],
} as const;
/** Describe a signed diary prompt-to-response lag, retaining responses recorded before the prompt for data review. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promptTimestampSeconds, responseTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      lagSeconds: responseTimestampSeconds - promptTimestampSeconds,
      precedesPrompt: responseTimestampSeconds < promptTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { promptTimestampSeconds: 1000, responseTimestampSeconds: 1120 },
  output: { lagSeconds: 120, precedesPrompt: false },
} satisfies ToolExample<Input, Output>;
export const diaryPromptResponseLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/diary-prompt-response-lag",
    title: "Diary Prompt Response Lag",
    description:
      "Describe a signed diary prompt-to-response lag, retaining responses recorded before the prompt for data review.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promptTimestampSeconds: { type: "number" },
        responseTimestampSeconds: { type: "number" },
      },
      required: ["promptTimestampSeconds", "responseTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagSeconds: { type: "number" },
        precedesPrompt: { type: "boolean" },
      },
      required: ["lagSeconds", "precedesPrompt"],
    },
    ports: {
      inputs: [
        {
          id: "promptTimestampSeconds",
          label: "Prompt Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseTimestampSeconds",
          label: "Response Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lagSeconds",
          label: "Lag Seconds",
          valueType: { type: "number" },
        },
        {
          id: "precedesPrompt",
          label: "Precedes Prompt",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = diaryPromptResponseLagTool.execute;
export default diaryPromptResponseLagTool;
