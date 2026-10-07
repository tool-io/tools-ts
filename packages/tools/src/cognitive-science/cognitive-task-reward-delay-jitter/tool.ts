import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseDelay: number;
  readonly suppliedJitter: number;
};
export type Output = { readonly actualDelay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseDelay: { type: "number", minimum: 0 },
    suppliedJitter: { type: "number" },
  },
  required: ["baseDelay", "suppliedJitter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { actualDelay: { type: "number" } },
  required: ["actualDelay"],
} as const;
/** Add an explicitly supplied signed jitter to a nonnegative reward delay without generating randomness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseDelay, suppliedJitter } = request;
  const compute = (): Output => {
    H.domain(baseDelay >= 0, "baseDelay");
    H.domain(baseDelay + suppliedJitter >= 0, "suppliedJitter");
    return { actualDelay: baseDelay + suppliedJitter };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseDelay: 2, suppliedJitter: 0.25 },
  output: { actualDelay: 2.25 },
} satisfies ToolExample<Input, Output>;
export const cognitiveTaskRewardDelayJitterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/cognitive-task-reward-delay-jitter",
    title: "Cognitive Task Reward Delay Jitter",
    description:
      "Add an explicitly supplied signed jitter to a nonnegative reward delay without generating randomness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseDelay: { type: "number", minimum: 0 },
        suppliedJitter: { type: "number" },
      },
      required: ["baseDelay", "suppliedJitter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { actualDelay: { type: "number" } },
      required: ["actualDelay"],
    },
    ports: {
      inputs: [
        {
          id: "baseDelay",
          label: "Base Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedJitter",
          label: "Supplied Jitter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualDelay",
          label: "Actual Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cognitiveTaskRewardDelayJitterTool.execute;
export default cognitiveTaskRewardDelayJitterTool;
