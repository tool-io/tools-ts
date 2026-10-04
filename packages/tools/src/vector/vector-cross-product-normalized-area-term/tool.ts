import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstNorm: number;
  readonly secondNorm: number;
  readonly crossMagnitude: number;
};
export type Output = { readonly sine: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNorm: { type: "number", exclusiveMinimum: 0 },
    secondNorm: { type: "number", exclusiveMinimum: 0 },
    crossMagnitude: { type: "number", minimum: 0 },
  },
  required: ["firstNorm", "secondNorm", "crossMagnitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sine: { type: "number" } },
  required: ["sine"],
} as const;
/** Calculate vector cross product normalized area term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstNorm, secondNorm, crossMagnitude } = input;
  const compute = (): Output => {
    H.positive(firstNorm);
    H.positive(secondNorm);
    H.domain(crossMagnitude >= 0 && crossMagnitude <= firstNorm * secondNorm);
    return { sine: crossMagnitude / (firstNorm * secondNorm) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstNorm: 3, secondNorm: 4, crossMagnitude: 6 },
  output: { sine: 0.5 },
} satisfies ToolExample<Input, Output>;
export const vectorCrossProductNormalizedAreaTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-cross-product-normalized-area-term",
      title: "Vector Cross Product Normalized Area Term Tool",
      description:
        "Calculate vector cross product normalized area term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstNorm: { type: "number", exclusiveMinimum: 0 },
          secondNorm: { type: "number", exclusiveMinimum: 0 },
          crossMagnitude: { type: "number", minimum: 0 },
        },
        required: ["firstNorm", "secondNorm", "crossMagnitude"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { sine: { type: "number" } },
        required: ["sine"],
      },
      ports: {
        inputs: [
          {
            id: "firstNorm",
            label: "First Norm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondNorm",
            label: "Second Norm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "crossMagnitude",
            label: "Cross Magnitude",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "sine", label: "Sine", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = vectorCrossProductNormalizedAreaTermTool.execute;
export default vectorCrossProductNormalizedAreaTermTool;
