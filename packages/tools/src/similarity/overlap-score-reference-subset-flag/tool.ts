import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly firstSize: number;
  readonly secondSize: number;
};
export type Output = {
  readonly score: number;
  readonly firstSubset: boolean;
  readonly secondSubset: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    firstSize: { type: "integer", minimum: 1 },
    secondSize: { type: "integer", minimum: 1 },
  },
  required: ["intersection", "firstSize", "secondSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    firstSubset: { type: "boolean" },
    secondSubset: { type: "boolean" },
  },
  required: ["score", "firstSubset", "secondSubset"],
} as const;
/** Calculate overlap score reference subset flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, firstSize, secondSize } = request;
  const compute = (): Output => {
    H.integer(firstSize, 1);
    H.integer(secondSize, 1);
    H.integer(intersection, 0, Math.min(firstSize, secondSize));
    return {
      score: intersection / Math.min(firstSize, secondSize),
      firstSubset: intersection === firstSize,
      secondSubset: intersection === secondSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 3, firstSize: 3, secondSize: 5 },
  output: { score: 1, firstSubset: true, secondSubset: false },
} satisfies ToolExample<Input, Output>;
export const overlapScoreReferenceSubsetFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/overlap-score-reference-subset-flag",
    title: "Overlap Score Reference Subset Flag Tool",
    description:
      "Calculate overlap score reference subset flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersection: { type: "integer", minimum: 0 },
        firstSize: { type: "integer", minimum: 1 },
        secondSize: { type: "integer", minimum: 1 },
      },
      required: ["intersection", "firstSize", "secondSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        firstSubset: { type: "boolean" },
        secondSubset: { type: "boolean" },
      },
      required: ["score", "firstSubset", "secondSubset"],
    },
    ports: {
      inputs: [
        {
          id: "intersection",
          label: "Intersection",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstSize",
          label: "First Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSize",
          label: "Second Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "score", label: "Score", valueType: { type: "number" } },
        {
          id: "firstSubset",
          label: "First Subset",
          valueType: { type: "boolean" },
        },
        {
          id: "secondSubset",
          label: "Second Subset",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = overlapScoreReferenceSubsetFlagTool.execute;
export default overlapScoreReferenceSubsetFlagTool;
