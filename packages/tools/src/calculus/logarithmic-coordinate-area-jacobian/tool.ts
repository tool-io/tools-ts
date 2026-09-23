import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly x: number;
  readonly y: number;
  readonly base: number;
};
export type Output = { readonly jacobian: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number", exclusiveMinimum: 0 },
    y: { type: "number", exclusiveMinimum: 0 },
    base: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "y", "base"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { jacobian: { type: "number" } },
  required: ["jacobian"],
} as const;
/** Compute logarithmic coordinate area jacobian from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { x, y, base } = input;
  const compute = (): Output => {
    positive(x);
    positive(y);
    positive(base);
    domain(base !== 1);
    return { jacobian: x * y * Math.log(base) ** 2 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 2, y: 3, base: 2.718281828459045 },
  output: { jacobian: 6 },
} satisfies ToolExample<Input, Output>;
export const logarithmicCoordinateAreaJacobianTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/logarithmic-coordinate-area-jacobian",
  title: "Logarithmic Coordinate Area Jacobian Tool",
  description:
    "Compute logarithmic coordinate area jacobian from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "x", label: "X", required: true, valueType: { type: "number" } },
      { id: "y", label: "Y", required: true, valueType: { type: "number" } },
      {
        id: "base",
        label: "Base",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "jacobian", label: "Jacobian", valueType: { type: "number" } },
    ],
  },
});
export const run = logarithmicCoordinateAreaJacobianTool.execute;
export default logarithmicCoordinateAreaJacobianTool;
