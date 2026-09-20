import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = { readonly defined: boolean; readonly magnitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, magnitude: { type: "number" } },
  required: ["defined", "magnitude"],
} as const;
/** Return absolute second derivative of x/(1+|x|), preserving nondifferentiability of its derivative at zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    return {
      defined: x !== 0,
      magnitude: x !== 0 ? 2 / (1 + Math.abs(x)) ** 3 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 1 },
  output: { defined: true, magnitude: 0.25 },
} satisfies ToolExample<Input, Output>;
export const softsignCurvatureMagnitudeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/softsign-curvature-magnitude",
    title: "Softsign Curvature Magnitude Tool",
    description:
      "Return absolute second derivative of x/(1+|x|), preserving nondifferentiability of its derivative at zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        magnitude: { type: "number" },
      },
      required: ["defined", "magnitude"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = softsignCurvatureMagnitudeTool.execute;
export default softsignCurvatureMagnitudeTool;
