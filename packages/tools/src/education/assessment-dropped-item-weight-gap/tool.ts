import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earned: readonly number[];
  readonly maximum: readonly number[];
  readonly weights: readonly number[];
  readonly dropped: readonly boolean[];
};
export type Output = {
  readonly earnedWeighted: number;
  readonly possibleWeighted: number;
  readonly removedWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earned: { type: "array", maxItems: 256, items: { type: "number" } },
    maximum: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    dropped: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["earned", "maximum", "weights", "dropped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earnedWeighted: { type: "number" },
    possibleWeighted: { type: "number" },
    removedWeight: { type: "number" },
  },
  required: ["earnedWeighted", "possibleWeighted", "removedWeight"],
} as const;
/** Calculate assessment dropped item weight gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earned, maximum, weights, dropped } = request;
  const compute = (): Output => {
    H.sameLength(earned, maximum);
    H.sameLength(earned, weights);
    H.sameLength(earned, dropped);
    H.domain(
      weights.every((x) => x >= 0) &&
        earned.every((x, i) => x >= 0 && maximum[i] >= x),
    );
    return {
      earnedWeighted: earned.reduce(
        (s, x, i) => s + (dropped[i] ? 0 : x * weights[i]),
        0,
      ),
      possibleWeighted: maximum.reduce(
        (s, x, i) => s + (dropped[i] ? 0 : x * weights[i]),
        0,
      ),
      removedWeight: weights.reduce((s, x, i) => s + (dropped[i] ? x : 0), 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earned: [8, 5],
    maximum: [10, 10],
    weights: [1, 2],
    dropped: [false, true],
  },
  output: { earnedWeighted: 8, possibleWeighted: 10, removedWeight: 2 },
} satisfies ToolExample<Input, Output>;
export const assessmentDroppedItemWeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/assessment-dropped-item-weight-gap",
    title: "Assessment Dropped Item Weight Gap Tool",
    description:
      "Calculate assessment dropped item weight gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earned: { type: "array", maxItems: 256, items: { type: "number" } },
        maximum: { type: "array", maxItems: 256, items: { type: "number" } },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        dropped: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["earned", "maximum", "weights", "dropped"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earnedWeighted: { type: "number" },
        possibleWeighted: { type: "number" },
        removedWeight: { type: "number" },
      },
      required: ["earnedWeighted", "possibleWeighted", "removedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "earned",
          label: "Earned",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "dropped",
          label: "Dropped",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "earnedWeighted",
          label: "Earned Weighted",
          valueType: { type: "number" },
        },
        {
          id: "possibleWeighted",
          label: "Possible Weighted",
          valueType: { type: "number" },
        },
        {
          id: "removedWeight",
          label: "Removed Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assessmentDroppedItemWeightGapTool.execute;
export default assessmentDroppedItemWeightGapTool;
