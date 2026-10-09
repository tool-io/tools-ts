import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTurnCount: number;
  readonly secondTurnCount: number;
};
export type Output = {
  readonly secondMinusFirst: number;
  readonly absoluteImbalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTurnCount: { type: "integer", minimum: 0 },
    secondTurnCount: { type: "integer", minimum: 0 },
  },
  required: ["firstTurnCount", "secondTurnCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondMinusFirst: { type: "integer" },
    absoluteImbalance: { type: "integer" },
  },
  required: ["secondMinusFirst", "absoluteImbalance"],
} as const;
/** Compare explicit deliberation turn counts without judging procedural fairness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTurnCount, secondTurnCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstTurnCount) &&
        firstTurnCount >= 0 &&
        firstTurnCount <= Number.MAX_SAFE_INTEGER,
      "firstTurnCount",
    ),
      firstTurnCount);
    (H.domain(
      Number.isSafeInteger(secondTurnCount) &&
        secondTurnCount >= 0 &&
        secondTurnCount <= Number.MAX_SAFE_INTEGER,
      "secondTurnCount",
    ),
      secondTurnCount);
    return {
      secondMinusFirst: secondTurnCount - firstTurnCount,
      absoluteImbalance: Math.abs(secondTurnCount - firstTurnCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTurnCount: 3, secondTurnCount: 7 },
  output: { secondMinusFirst: 4, absoluteImbalance: 4 },
} satisfies ToolExample<Input, Output>;
export const deliberationTurnImbalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/deliberation-turn-imbalance",
    title: "Deliberation Turn Imbalance",
    description:
      "Compare explicit deliberation turn counts without judging procedural fairness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTurnCount: { type: "integer", minimum: 0 },
        secondTurnCount: { type: "integer", minimum: 0 },
      },
      required: ["firstTurnCount", "secondTurnCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondMinusFirst: { type: "integer" },
        absoluteImbalance: { type: "integer" },
      },
      required: ["secondMinusFirst", "absoluteImbalance"],
    },
    ports: {
      inputs: [
        {
          id: "firstTurnCount",
          label: "First Turn Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondTurnCount",
          label: "Second Turn Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "secondMinusFirst",
          label: "Second Minus First",
          valueType: { type: "integer" },
        },
        {
          id: "absoluteImbalance",
          label: "Absolute Imbalance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = deliberationTurnImbalanceTool.execute;
export default deliberationTurnImbalanceTool;
