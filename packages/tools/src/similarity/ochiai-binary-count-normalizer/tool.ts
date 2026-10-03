import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly firstSize: number;
  readonly secondSize: number;
};
export type Output = { readonly normalizer: number; readonly score: number };
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
  properties: { normalizer: { type: "number" }, score: { type: "number" } },
  required: ["normalizer", "score"],
} as const;
/** Calculate ochiai binary count normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, firstSize, secondSize } = request;
  const compute = (): Output => {
    H.integer(firstSize, 1);
    H.integer(secondSize, 1);
    H.integer(intersection, 0, Math.min(firstSize, secondSize));
    const normalizer = Math.sqrt(firstSize * secondSize);
    return { normalizer, score: intersection / normalizer };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 3, firstSize: 4, secondSize: 9 },
  output: { normalizer: 6, score: 0.5 },
} satisfies ToolExample<Input, Output>;
export const ochiaiBinaryCountNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/ochiai-binary-count-normalizer",
    title: "Ochiai Binary Count Normalizer Tool",
    description:
      "Calculate ochiai binary count normalizer from explicit caller-supplied inputs.",
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
      properties: { normalizer: { type: "number" }, score: { type: "number" } },
      required: ["normalizer", "score"],
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
        {
          id: "normalizer",
          label: "Normalizer",
          valueType: { type: "number" },
        },
        { id: "score", label: "Score", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ochiaiBinaryCountNormalizerTool.execute;
export default ochiaiBinaryCountNormalizerTool;
