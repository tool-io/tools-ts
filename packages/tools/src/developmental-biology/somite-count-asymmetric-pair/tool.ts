import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leftCount: number; readonly rightCount: number };
export type Output = {
  readonly totalCount: number;
  readonly rightMinusLeft: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftCount: { type: "integer", minimum: 0 },
    rightCount: { type: "integer", minimum: 0 },
  },
  required: ["leftCount", "rightCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCount: { type: "integer" },
    rightMinusLeft: { type: "integer" },
  },
  required: ["totalCount", "rightMinusLeft"],
} as const;
/** Report supplied left/right somite count sum and signed asymmetry without assigning embryonic stage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftCount, rightCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(leftCount) &&
        leftCount >= 0 &&
        leftCount <= Number.MAX_SAFE_INTEGER,
      "leftCount",
    ),
      leftCount);
    (H.domain(
      Number.isSafeInteger(rightCount) &&
        rightCount >= 0 &&
        rightCount <= Number.MAX_SAFE_INTEGER,
      "rightCount",
    ),
      rightCount);
    return {
      totalCount: Number(BigInt(leftCount) + BigInt(rightCount)),
      rightMinusLeft: rightCount - leftCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftCount: 12, rightCount: 13 },
  output: { totalCount: 25, rightMinusLeft: 1 },
} satisfies ToolExample<Input, Output>;
export const somiteCountAsymmetricPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/somite-count-asymmetric-pair",
    title: "Somite Count Asymmetric Pair Tool",
    description:
      "Report supplied left/right somite count sum and signed asymmetry without assigning embryonic stage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftCount: { type: "integer", minimum: 0 },
        rightCount: { type: "integer", minimum: 0 },
      },
      required: ["leftCount", "rightCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCount: { type: "integer" },
        rightMinusLeft: { type: "integer" },
      },
      required: ["totalCount", "rightMinusLeft"],
    },
    ports: {
      inputs: [
        {
          id: "leftCount",
          label: "Left Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rightCount",
          label: "Right Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalCount",
          label: "Total Count",
          valueType: { type: "integer" },
        },
        {
          id: "rightMinusLeft",
          label: "Right Minus Left",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = somiteCountAsymmetricPairTool.execute;
export default somiteCountAsymmetricPairTool;
