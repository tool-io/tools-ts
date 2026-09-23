import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type Output = { readonly schwarzian: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    third: { type: "number" },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { schwarzian: { type: "number" } },
  required: ["schwarzian"],
} as const;
/** Calculate scalar schwarzian from derivatives from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, third } = input;
  const compute = (): Output => {
    H.domain(first !== 0);
    return { schwarzian: third / first - 1.5 * (second / first) ** 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 2, second: 4, third: 6 },
  output: { schwarzian: -3 },
} satisfies ToolExample<Input, Output>;
export const scalarSchwarzianFromDerivativesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/scalar-schwarzian-from-derivatives",
    title: "Scalar Schwarzian From Derivatives Tool",
    description:
      "Calculate scalar schwarzian from derivatives from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        third: { type: "number" },
      },
      required: ["first", "second", "third"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { schwarzian: { type: "number" } },
      required: ["schwarzian"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "schwarzian",
          label: "Schwarzian",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scalarSchwarzianFromDerivativesTool.execute;
export default scalarSchwarzianFromDerivativesTool;
