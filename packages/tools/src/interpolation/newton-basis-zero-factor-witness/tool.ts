import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number; readonly nodes: readonly number[] };
export type Output = { readonly zero: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["x", "nodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zero: { type: "boolean" }, index: { type: "integer" } },
  required: ["zero", "index"],
} as const;
/** Calculate newton basis zero factor witness from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, nodes } = input;
  const compute = (): Output => {
    const index = nodes.indexOf(x);
    return { zero: index >= 0, index };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 2, nodes: [0, 1, 2] },
  output: { zero: true, index: 2 },
} satisfies ToolExample<Input, Output>;
export const newtonBasisZeroFactorWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/newton-basis-zero-factor-witness",
    title: "Newton Basis Zero Factor Witness Tool",
    description:
      "Calculate newton basis zero factor witness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["x", "nodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { zero: { type: "boolean" }, index: { type: "integer" } },
      required: ["zero", "index"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "nodes",
          label: "Nodes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "zero", label: "Zero", valueType: { type: "boolean" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = newtonBasisZeroFactorWitnessTool.execute;
export default newtonBasisZeroFactorWitnessTool;
