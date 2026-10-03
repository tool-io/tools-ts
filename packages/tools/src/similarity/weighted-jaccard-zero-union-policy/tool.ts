import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly union: number;
  readonly emptyScore: number;
};
export type Output = { readonly score: number; readonly empty: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "number", minimum: 0 },
    union: { type: "number" },
    emptyScore: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["intersection", "union", "emptyScore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "number" }, empty: { type: "boolean" } },
  required: ["score", "empty"],
} as const;
/** Calculate weighted jaccard zero union policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, union, emptyScore } = request;
  const compute = (): Output => {
    H.domain(intersection >= 0 && union >= intersection);
    H.probability(emptyScore);
    return {
      score: union === 0 ? emptyScore : intersection / union,
      empty: union === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 0, union: 0, emptyScore: 1 },
  output: { score: 1, empty: true },
} satisfies ToolExample<Input, Output>;
export const weightedJaccardZeroUnionPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/weighted-jaccard-zero-union-policy",
    title: "Weighted Jaccard Zero Union Policy Tool",
    description:
      "Calculate weighted jaccard zero union policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersection: { type: "number", minimum: 0 },
        union: { type: "number" },
        emptyScore: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["intersection", "union", "emptyScore"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { score: { type: "number" }, empty: { type: "boolean" } },
      required: ["score", "empty"],
    },
    ports: {
      inputs: [
        {
          id: "intersection",
          label: "Intersection",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "union",
          label: "Union",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emptyScore",
          label: "Empty Score",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "score", label: "Score", valueType: { type: "number" } },
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = weightedJaccardZeroUnionPolicyTool.execute;
export default weightedJaccardZeroUnionPolicyTool;
