import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minimum: number;
  readonly maximum: number;
  readonly tolerance: number;
};
export type Output = { readonly span: number; readonly degenerate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "number" },
    maximum: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["minimum", "maximum", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { span: { type: "number" }, degenerate: { type: "boolean" } },
  required: ["span", "degenerate"],
} as const;
/** Calculate feature range minmax explicit tolerance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { minimum, maximum, tolerance } = input;
  const compute = (): Output => {
    H.domain(maximum >= minimum && tolerance >= 0);
    const span = maximum - minimum;
    return { span, degenerate: span <= tolerance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { minimum: 2, maximum: 5, tolerance: 0.1 },
  output: { span: 3, degenerate: false },
} satisfies ToolExample<Input, Output>;
export const featureRangeMinmaxExplicitToleranceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "normalize/feature-range-minmax-explicit-tolerance",
      title: "Feature Range Minmax Explicit Tolerance Tool",
      description:
        "Calculate feature range minmax explicit tolerance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimum: { type: "number" },
          maximum: { type: "number" },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["minimum", "maximum", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          span: { type: "number" },
          degenerate: { type: "boolean" },
        },
        required: ["span", "degenerate"],
      },
      ports: {
        inputs: [
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "span", label: "Span", valueType: { type: "number" } },
          {
            id: "degenerate",
            label: "Degenerate",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = featureRangeMinmaxExplicitToleranceTool.execute;
export default featureRangeMinmaxExplicitToleranceTool;
