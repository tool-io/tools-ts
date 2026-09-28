import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly verticalTransverse: boolean;
};
export type Output = {
  readonly positiveSlope: number;
  readonly negativeSlope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number", exclusiveMinimum: 0 },
    b: { type: "number", exclusiveMinimum: 0 },
    verticalTransverse: { type: "boolean" },
  },
  required: ["a", "b", "verticalTransverse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveSlope: { type: "number" },
    negativeSlope: { type: "number" },
  },
  required: ["positiveSlope", "negativeSlope"],
} as const;
/** Calculate hyperbola asymptote direction slope from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, verticalTransverse } = input;
  const compute = (): Output => {
    H.positive(a);
    H.positive(b);
    const slope = verticalTransverse ? a / b : b / a;
    return { positiveSlope: slope, negativeSlope: -slope };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 4, b: 3, verticalTransverse: false },
  output: { positiveSlope: 0.75, negativeSlope: -0.75 },
} satisfies ToolExample<Input, Output>;
export const hyperbolaAsymptoteDirectionSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/hyperbola-asymptote-direction-slope",
    title: "Hyperbola Asymptote Direction Slope Tool",
    description:
      "Calculate hyperbola asymptote direction slope from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number", exclusiveMinimum: 0 },
        b: { type: "number", exclusiveMinimum: 0 },
        verticalTransverse: { type: "boolean" },
      },
      required: ["a", "b", "verticalTransverse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveSlope: { type: "number" },
        negativeSlope: { type: "number" },
      },
      required: ["positiveSlope", "negativeSlope"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        {
          id: "verticalTransverse",
          label: "Vertical Transverse",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "positiveSlope",
          label: "Positive Slope",
          valueType: { type: "number" },
        },
        {
          id: "negativeSlope",
          label: "Negative Slope",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hyperbolaAsymptoteDirectionSlopeTool.execute;
export default hyperbolaAsymptoteDirectionSlopeTool;
