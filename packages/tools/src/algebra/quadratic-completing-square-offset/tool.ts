import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
};
export type Output = { readonly shift: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
  },
  required: ["a", "b", "c"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shift: { type: "number" }, offset: { type: "number" } },
  required: ["shift", "offset"],
} as const;
/** Calculate quadratic completing square offset from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c } = input;
  const compute = (): Output => {
    H.domain(a !== 0);
    return { shift: b / (2 * a), offset: c - (b * b) / (4 * a) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 8, c: 3 },
  output: { shift: 2, offset: -5 },
} satisfies ToolExample<Input, Output>;
export const quadraticCompletingSquareOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/quadratic-completing-square-offset",
    title: "Quadratic Completing Square Offset Tool",
    description:
      "Calculate quadratic completing square offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
      },
      required: ["a", "b", "c"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shift: { type: "number" }, offset: { type: "number" } },
      required: ["shift", "offset"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "shift", label: "Shift", valueType: { type: "number" } },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = quadraticCompletingSquareOffsetTool.execute;
export default quadraticCompletingSquareOffsetTool;
