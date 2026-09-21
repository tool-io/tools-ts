import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly crossTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { crossTerm: { type: "number" } },
  required: ["crossTerm"],
} as const;
/** Calculate binomial square cross term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    return { crossTerm: 2 * first * second };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 3, second: -4 },
  output: { crossTerm: -24 },
} satisfies ToolExample<Input, Output>;
export const binomialSquareCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/binomial-square-cross-term",
    title: "Binomial Square Cross Term Tool",
    description:
      "Calculate binomial square cross term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { crossTerm: { type: "number" } },
      required: ["crossTerm"],
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
      ],
      outputs: [
        { id: "crossTerm", label: "Cross Term", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = binomialSquareCrossTermTool.execute;
export default binomialSquareCrossTermTool;
