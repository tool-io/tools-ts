import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly y: number };
export type Output = { readonly angle: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angle: { type: "number" }, sign: { type: "integer" } },
  required: ["angle", "sign"],
} as const;
/** Calculate vector two dimensional polar angle sign from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, y } = input;
  const compute = (): Output => {
    H.domain(x !== 0 || y !== 0);
    const angle = Math.atan2(y, x);
    return { angle, sign: Math.sign(angle) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 0, y: -2 },
  output: { angle: -1.5707963267948966, sign: -1 },
} satisfies ToolExample<Input, Output>;
export const vectorTwoDimensionalPolarAngleSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-two-dimensional-polar-angle-sign",
    title: "Vector Two Dimensional Polar Angle Sign Tool",
    description:
      "Calculate vector two dimensional polar angle sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, y: { type: "number" } },
      required: ["x", "y"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angle: { type: "number" }, sign: { type: "integer" } },
      required: ["angle", "sign"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "angle", label: "Angle", valueType: { type: "number" } },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = vectorTwoDimensionalPolarAngleSignTool.execute;
export default vectorTwoDimensionalPolarAngleSignTool;
