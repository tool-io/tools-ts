import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
};
export type Output = { readonly resultant: number };
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
  properties: { resultant: { type: "number" } },
  required: ["resultant"],
} as const;
/** Calculate resultant linear linear term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b, c, d } = input;
  const compute = (): Output => {
    H.domain(a !== 0 && c !== 0);
    return { resultant: a * d - b * c };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 3, c: 4, d: 5 },
  output: { resultant: -2 },
} satisfies ToolExample<Input, Output>;
export const resultantLinearLinearTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/resultant-linear-linear-term",
    title: "Resultant Linear Linear Term Tool",
    description:
      "Calculate resultant linear linear term from explicit caller-supplied inputs.",
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
      properties: { resultant: { type: "number" } },
      required: ["resultant"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
        { id: "c", label: "C", required: true, valueType: { type: "number" } },
        { id: "d", label: "D", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        { id: "resultant", label: "Resultant", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = resultantLinearLinearTermTool.execute;
export default resultantLinearLinearTermTool;
