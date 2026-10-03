import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly order: number; readonly index: number };
export type Output = { readonly coefficient: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    order: { type: "integer", minimum: 0, maximum: 128 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["order", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "string", maxLength: 8192 } },
  required: ["coefficient"],
} as const;
/** Calculate finite difference binomial weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { order, index } = request;
  const compute = (): Output => {
    H.integer(order, 0, 128);
    H.integer(index, 0, order);
    let c = 1n;
    for (let i = 1; i <= index; i++)
      c = (c * BigInt(order - i + 1)) / BigInt(i);
    return { coefficient: String((order - index) % 2 === 0 ? c : -c) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { order: 3, index: 1 },
  output: { coefficient: "3" },
} satisfies ToolExample<Input, Output>;
export const finiteDifferenceBinomialWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/finite-difference-binomial-weight-term",
    title: "Finite Difference Binomial Weight Term Tool",
    description:
      "Calculate finite difference binomial weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        order: { type: "integer", minimum: 0, maximum: 128 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["order", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coefficient: { type: "string", maxLength: 8192 } },
      required: ["coefficient"],
    },
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
      outputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteDifferenceBinomialWeightTermTool.execute;
export default finiteDifferenceBinomialWeightTermTool;
