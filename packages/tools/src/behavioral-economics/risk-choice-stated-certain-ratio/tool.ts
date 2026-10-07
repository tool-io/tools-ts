import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly statedCertainValue: number;
  readonly expectedLotteryValue: number;
};
export type Output = { readonly certainToExpectedRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statedCertainValue: { type: "number" },
    expectedLotteryValue: { type: "number" },
  },
  required: ["statedCertainValue", "expectedLotteryValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { certainToExpectedRatio: { type: "number" } },
  required: ["certainToExpectedRatio"],
} as const;
/** Divide an explicit stated certain value by a nonzero expected lottery value without interpreting risk attitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statedCertainValue, expectedLotteryValue } = request;
  const compute = (): Output => {
    H.domain(expectedLotteryValue !== 0, "expectedLotteryValue");
    return {
      certainToExpectedRatio: statedCertainValue / expectedLotteryValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { statedCertainValue: 40, expectedLotteryValue: 50 },
  output: { certainToExpectedRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const riskChoiceStatedCertainRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/risk-choice-stated-certain-ratio",
    title: "Risk Choice Stated Certain Ratio",
    description:
      "Divide an explicit stated certain value by a nonzero expected lottery value without interpreting risk attitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statedCertainValue: { type: "number" },
        expectedLotteryValue: { type: "number" },
      },
      required: ["statedCertainValue", "expectedLotteryValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { certainToExpectedRatio: { type: "number" } },
      required: ["certainToExpectedRatio"],
    },
    ports: {
      inputs: [
        {
          id: "statedCertainValue",
          label: "Stated Certain Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedLotteryValue",
          label: "Expected Lottery Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "certainToExpectedRatio",
          label: "Certain To Expected Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskChoiceStatedCertainRatioTool.execute;
export default riskChoiceStatedCertainRatioTool;
