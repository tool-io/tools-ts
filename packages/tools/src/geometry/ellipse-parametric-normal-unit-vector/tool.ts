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
  readonly a: number;
  readonly b: number;
  readonly cosParameter: number;
  readonly sinParameter: number;
};
export type Output = { readonly normal: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number", exclusiveMinimum: 0 },
    b: { type: "number", exclusiveMinimum: 0 },
    cosParameter: { type: "number" },
    sinParameter: { type: "number" },
  },
  required: ["a", "b", "cosParameter", "sinParameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["normal"],
} as const;
/** Compute ellipse parametric normal unit vector from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { a, b, cosParameter, sinParameter } = input;
  const compute = (): Output => {
    positive(a);
    positive(b);
    domain(Math.abs(cosParameter ** 2 + sinParameter ** 2 - 1) < 1e-12);
    const x = cosParameter / a,
      y = sinParameter / b,
      n = Math.hypot(x, y);
    return { normal: [x / n, y / n] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 1, cosParameter: 1, sinParameter: 0 },
  output: { normal: [1, 0] },
} satisfies ToolExample<Input, Output>;
export const ellipseParametricNormalUnitVectorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/ellipse-parametric-normal-unit-vector",
  title: "Ellipse Parametric Normal Unit Vector Tool",
  description:
    "Compute ellipse parametric normal unit vector from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "a", label: "A", required: true, valueType: { type: "number" } },
      { id: "b", label: "B", required: true, valueType: { type: "number" } },
      {
        id: "cosParameter",
        label: "Cos Parameter",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "sinParameter",
        label: "Sin Parameter",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "normal",
        label: "Normal",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = ellipseParametricNormalUnitVectorTool.execute;
export default ellipseParametricNormalUnitVectorTool;
