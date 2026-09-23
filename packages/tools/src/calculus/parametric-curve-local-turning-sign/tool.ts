import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly dx: number;
  readonly dy: number;
  readonly ddx: number;
  readonly ddy: number;
};
export type Output = { readonly cross: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dx: { type: "number" },
    dy: { type: "number" },
    ddx: { type: "number" },
    ddy: { type: "number" },
  },
  required: ["dx", "dy", "ddx", "ddy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cross: { type: "number" }, sign: { type: "integer" } },
  required: ["cross", "sign"],
} as const;
/** Compute parametric curve local turning sign from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { dx, dy, ddx, ddy } = input;
  const compute = (): Output => {
    domain(dx !== 0 || dy !== 0);
    const cross = dx * ddy - dy * ddx;
    return { cross, sign: Math.sign(cross) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { dx: 1, dy: 0, ddx: 0, ddy: 2 },
  output: { cross: 2, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const parametricCurveLocalTurningSignTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/parametric-curve-local-turning-sign",
  title: "Parametric Curve Local Turning Sign Tool",
  description:
    "Compute parametric curve local turning sign from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "dx", label: "Dx", required: true, valueType: { type: "number" } },
      { id: "dy", label: "Dy", required: true, valueType: { type: "number" } },
      {
        id: "ddx",
        label: "Ddx",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "ddy",
        label: "Ddy",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "cross", label: "Cross", valueType: { type: "number" } },
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
    ],
  },
});
export const run = parametricCurveLocalTurningSignTool.execute;
export default parametricCurveLocalTurningSignTool;
