import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dot: number;
  readonly firstOnes: number;
  readonly secondOnes: number;
};
export type Output = { readonly union: number; readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "integer", minimum: 0 },
    firstOnes: { type: "integer", minimum: 0 },
    secondOnes: { type: "integer", minimum: 0 },
  },
  required: ["dot", "firstOnes", "secondOnes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { union: { type: "integer" }, score: { type: "number" } },
  required: ["union", "score"],
} as const;
/** Calculate tanimoto binary dot norm identity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dot, firstOnes, secondOnes } = request;
  const compute = (): Output => {
    H.integer(firstOnes, 0);
    H.integer(secondOnes, 0);
    H.integer(dot, 0, Math.min(firstOnes, secondOnes));
    const union = firstOnes + secondOnes - dot;
    H.positive(union);
    return { union, score: dot / union };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dot: 3, firstOnes: 4, secondOnes: 5 },
  output: { union: 6, score: 0.5 },
} satisfies ToolExample<Input, Output>;
export const tanimotoBinaryDotNormIdentityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/tanimoto-binary-dot-norm-identity",
    title: "Tanimoto Binary Dot Norm Identity Tool",
    description:
      "Calculate tanimoto binary dot norm identity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dot: { type: "integer", minimum: 0 },
        firstOnes: { type: "integer", minimum: 0 },
        secondOnes: { type: "integer", minimum: 0 },
      },
      required: ["dot", "firstOnes", "secondOnes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { union: { type: "integer" }, score: { type: "number" } },
      required: ["union", "score"],
    },
    ports: {
      inputs: [
        {
          id: "dot",
          label: "Dot",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstOnes",
          label: "First Ones",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOnes",
          label: "Second Ones",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "union", label: "Union", valueType: { type: "integer" } },
        { id: "score", label: "Score", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tanimotoBinaryDotNormIdentityTool.execute;
export default tanimotoBinaryDotNormIdentityTool;
