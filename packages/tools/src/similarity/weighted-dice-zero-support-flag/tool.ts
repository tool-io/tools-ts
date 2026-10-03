import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersectionWeight: number;
  readonly firstWeight: number;
  readonly secondWeight: number;
  readonly zeroSupportValue: number;
};
export type Output = { readonly defined: boolean; readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersectionWeight: { type: "number", minimum: 0 },
    firstWeight: { type: "number", minimum: 0 },
    secondWeight: { type: "number", minimum: 0 },
    zeroSupportValue: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "intersectionWeight",
    "firstWeight",
    "secondWeight",
    "zeroSupportValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, score: { type: "number" } },
  required: ["defined", "score"],
} as const;
/** Calculate weighted dice zero support flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersectionWeight, firstWeight, secondWeight, zeroSupportValue } =
    request;
  const compute = (): Output => {
    H.domain(
      firstWeight >= 0 &&
        secondWeight >= 0 &&
        intersectionWeight >= 0 &&
        intersectionWeight <= Math.min(firstWeight, secondWeight),
    );
    H.probability(zeroSupportValue);
    return {
      defined: firstWeight + secondWeight > 0,
      score:
        firstWeight + secondWeight > 0
          ? (2 * intersectionWeight) / (firstWeight + secondWeight)
          : zeroSupportValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    intersectionWeight: 0,
    firstWeight: 0,
    secondWeight: 0,
    zeroSupportValue: 1,
  },
  output: { defined: false, score: 1 },
} satisfies ToolExample<Input, Output>;
export const weightedDiceZeroSupportFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/weighted-dice-zero-support-flag",
    title: "Weighted Dice Zero Support Flag Tool",
    description:
      "Calculate weighted dice zero support flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersectionWeight: { type: "number", minimum: 0 },
        firstWeight: { type: "number", minimum: 0 },
        secondWeight: { type: "number", minimum: 0 },
        zeroSupportValue: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "intersectionWeight",
        "firstWeight",
        "secondWeight",
        "zeroSupportValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defined: { type: "boolean" }, score: { type: "number" } },
      required: ["defined", "score"],
    },
    ports: {
      inputs: [
        {
          id: "intersectionWeight",
          label: "Intersection Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstWeight",
          label: "First Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWeight",
          label: "Second Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroSupportValue",
          label: "Zero Support Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "score", label: "Score", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = weightedDiceZeroSupportFlagTool.execute;
export default weightedDiceZeroSupportFlagTool;
