import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sumWeights: number;
  readonly sumSquaredWeights: number;
  readonly oldWeight: number;
  readonly firstPart: number;
};
export type Output = {
  readonly before: number;
  readonly after: number;
  readonly change: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumWeights: { type: "number", exclusiveMinimum: 0 },
    sumSquaredWeights: { type: "number", exclusiveMinimum: 0 },
    oldWeight: { type: "number", minimum: 0 },
    firstPart: { type: "number", minimum: 0 },
  },
  required: ["sumWeights", "sumSquaredWeights", "oldWeight", "firstPart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number" },
    after: { type: "number" },
    change: { type: "number" },
  },
  required: ["before", "after", "change"],
} as const;
/** Calculate effective sample size weight split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sumWeights, sumSquaredWeights, oldWeight, firstPart } = request;
  const compute = (): Output => {
    H.positive(sumWeights);
    H.positive(sumSquaredWeights);
    H.domain(
      oldWeight >= 0 &&
        oldWeight <= sumWeights &&
        firstPart >= 0 &&
        firstPart <= oldWeight &&
        oldWeight * oldWeight <= sumSquaredWeights,
    );
    const second = oldWeight - firstPart,
      newSquares =
        sumSquaredWeights -
        oldWeight * oldWeight +
        firstPart * firstPart +
        second * second;
    H.positive(newSquares);
    const before = (sumWeights * sumWeights) / sumSquaredWeights,
      after = (sumWeights * sumWeights) / newSquares;
    return { before, after, change: after - before };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sumWeights: 4, sumSquaredWeights: 8, oldWeight: 2, firstPart: 1 },
  output: { before: 2, after: 2.6666666666666665, change: 0.6666666666666665 },
} satisfies ToolExample<Input, Output>;
export const effectiveSampleSizeWeightSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/effective-sample-size-weight-split",
    title: "Effective Sample Size Weight Split Tool",
    description:
      "Calculate effective sample size weight split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumWeights: { type: "number", exclusiveMinimum: 0 },
        sumSquaredWeights: { type: "number", exclusiveMinimum: 0 },
        oldWeight: { type: "number", minimum: 0 },
        firstPart: { type: "number", minimum: 0 },
      },
      required: ["sumWeights", "sumSquaredWeights", "oldWeight", "firstPart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "number" },
        after: { type: "number" },
        change: { type: "number" },
      },
      required: ["before", "after", "change"],
    },
    ports: {
      inputs: [
        {
          id: "sumWeights",
          label: "Sum Weights",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sumSquaredWeights",
          label: "Sum Squared Weights",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldWeight",
          label: "Old Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstPart",
          label: "First Part",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "before", label: "Before", valueType: { type: "number" } },
        { id: "after", label: "After", valueType: { type: "number" } },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = effectiveSampleSizeWeightSplitTool.execute;
export default effectiveSampleSizeWeightSplitTool;
