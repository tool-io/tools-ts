import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selectedSymbol: string;
  readonly rewardSymbol: string;
};
export type Output = { readonly matchesReward: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedSymbol: { type: "string", maxLength: 8192, minLength: 1 },
    rewardSymbol: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["selectedSymbol", "rewardSymbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matchesReward: { type: "boolean" } },
  required: ["matchesReward"],
} as const;
/** Compare exact supplied task-choice and reward symbol text without scoring developmental performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selectedSymbol, rewardSymbol } = request;
  const compute = (): Output => {
    H.domain(selectedSymbol.length > 0, "selectedSymbol");
    H.domain(rewardSymbol.length > 0, "rewardSymbol");
    return { matchesReward: selectedSymbol === rewardSymbol };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { selectedSymbol: "★", rewardSymbol: "★" },
  output: { matchesReward: true },
} satisfies ToolExample<Input, Output>;
export const taskRewardChoiceSymbolMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/task-reward-choice-symbol-match",
    title: "Task Reward Choice Symbol Match Tool",
    description:
      "Compare exact supplied task-choice and reward symbol text without scoring developmental performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedSymbol: { type: "string", maxLength: 8192, minLength: 1 },
        rewardSymbol: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["selectedSymbol", "rewardSymbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matchesReward: { type: "boolean" } },
      required: ["matchesReward"],
    },
    ports: {
      inputs: [
        {
          id: "selectedSymbol",
          label: "Selected Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rewardSymbol",
          label: "Reward Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchesReward",
          label: "Matches Reward",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskRewardChoiceSymbolMatchTool.execute;
export default taskRewardChoiceSymbolMatchTool;
