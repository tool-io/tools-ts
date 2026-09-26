import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successProbability: number;
  readonly itemPoints: number;
  readonly judgeWeight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successProbability: { type: "number", minimum: 0, maximum: 1 },
    itemPoints: { type: "number", minimum: 0 },
    judgeWeight: { type: "number", minimum: 0 },
  },
  required: ["successProbability", "itemPoints", "judgeWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate one supplied judge/item contribution without inferring a passing threshold or standard-setting policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successProbability, itemPoints, judgeWeight } = request;
  const compute = (): Output => {
    H.probability(successProbability);
    H.domain(itemPoints >= 0 && judgeWeight >= 0);
    return { contribution: successProbability * itemPoints * judgeWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { successProbability: 0.6, itemPoints: 5, judgeWeight: 0.25 },
  output: { contribution: 0.75 },
} satisfies ToolExample<Input, Output>;
export const standardSettingOneJudgeItemTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/standard-setting-one-judge-item-term",
    title: "Standard Setting One Judge Item Term Tool",
    description:
      "Calculate one supplied judge/item contribution without inferring a passing threshold or standard-setting policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successProbability: { type: "number", minimum: 0, maximum: 1 },
        itemPoints: { type: "number", minimum: 0 },
        judgeWeight: { type: "number", minimum: 0 },
      },
      required: ["successProbability", "itemPoints", "judgeWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "successProbability",
          label: "Success Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "itemPoints",
          label: "Item Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "judgeWeight",
          label: "Judge Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = standardSettingOneJudgeItemTermTool.execute;
export default standardSettingOneJudgeItemTermTool;
