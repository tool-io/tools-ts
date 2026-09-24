import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { binomial } from "../../math/pascal-row/tool.js";
export type Input = { readonly order: number; readonly index: number };
export type Output = { readonly term: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    order: { type: "integer", minimum: 1, maximum: 64 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["order", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { term: { type: "string", maxLength: 8192 } },
  required: ["term"],
} as const;
/** Compute catalan convolution single summand from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { order, index } = input;
  const compute = (): Output => {
    integer(order, 1, 64);
    integer(index, 0, order - 1);
    const c = (n: number): bigint => binomial(2 * n, n) / BigInt(n + 1);
    return { term: (c(index) * c(order - 1 - index)).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { order: 4, index: 1 },
  output: { term: "2" },
} satisfies ToolExample<Input, Output>;
export const catalanConvolutionSingleSummandTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/catalan-convolution-single-summand",
  title: "Catalan Convolution Single Summand Tool",
  description:
    "Compute catalan convolution single summand from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "order",
        label: "Order",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "term", label: "Term", valueType: { type: "string" } }],
  },
});
export const run = catalanConvolutionSingleSummandTool.execute;
export default catalanConvolutionSingleSummandTool;
