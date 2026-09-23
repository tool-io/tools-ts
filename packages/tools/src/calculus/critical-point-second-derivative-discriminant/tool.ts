import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly xx: number;
  readonly xy: number;
  readonly yy: number;
};
export type Output = {
  readonly determinant: number;
  readonly classification: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xx: { type: "number" },
    xy: { type: "number" },
    yy: { type: "number" },
  },
  required: ["xx", "xy", "yy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    determinant: { type: "number" },
    classification: { type: "string", maxLength: 8192 },
  },
  required: ["determinant", "classification"],
} as const;
/** Calculate critical point second derivative discriminant from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { xx, xy, yy } = input;
  const compute = (): Output => {
    const determinant = xx * yy - xy * xy;
    return {
      determinant,
      classification:
        determinant < 0
          ? "saddle"
          : determinant === 0
            ? "inconclusive"
            : xx > 0
              ? "minimum"
              : "maximum",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { xx: 2, xy: 1, yy: 3 },
  output: { determinant: 5, classification: "minimum" },
} satisfies ToolExample<Input, Output>;
export const criticalPointSecondDerivativeDiscriminantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "calculus/critical-point-second-derivative-discriminant",
      title: "Critical Point Second Derivative Discriminant Tool",
      description:
        "Calculate critical point second derivative discriminant from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          xx: { type: "number" },
          xy: { type: "number" },
          yy: { type: "number" },
        },
        required: ["xx", "xy", "yy"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          determinant: { type: "number" },
          classification: { type: "string", maxLength: 8192 },
        },
        required: ["determinant", "classification"],
      },
      ports: {
        inputs: [
          {
            id: "xx",
            label: "Xx",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "xy",
            label: "Xy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yy",
            label: "Yy",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "determinant",
            label: "Determinant",
            valueType: { type: "number" },
          },
          {
            id: "classification",
            label: "Classification",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = criticalPointSecondDerivativeDiscriminantTool.execute;
export default criticalPointSecondDerivativeDiscriminantTool;
