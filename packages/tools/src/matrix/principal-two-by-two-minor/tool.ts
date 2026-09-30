import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = { readonly determinant: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "number" },
    b: { type: "number" },
    c: { type: "number" },
    d: { type: "number" },
  },
  required: ["a", "b", "c", "d"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { determinant: { type: "number" } },
  required: ["determinant"],
} as const;
/** Evaluate the determinant of an explicitly supplied principal two-by-two block; membership in a larger matrix is caller supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c, d } = request;
  const compute = (): Output => {
    return { determinant: a * d - b * c };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: 3, b: 2, c: 2, d: 4 },
  output: { determinant: 8 },
} satisfies ToolExample<Input, Output>;
export const principalTwoByTwoMinorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/principal-two-by-two-minor",
    title: "Principal Two By Two Minor Tool",
    description:
      "Evaluate the determinant of an explicitly supplied principal two-by-two block; membership in a larger matrix is caller supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        c: { type: "number" },
        d: { type: "number" },
      },
      required: ["a", "b", "c", "d"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { determinant: { type: "number" } },
      required: ["determinant"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "determinant",
          label: "Determinant",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = principalTwoByTwoMinorTool.execute;
export default principalTwoByTwoMinorTool;
