import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly firstPositive: boolean;
};
export type Output = { readonly balance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    firstPositive: { type: "boolean" },
  },
  required: ["length", "firstPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { balance: { type: "integer" } },
  required: ["balance"],
} as const;
/** Calculate alternating prefix balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, firstPositive } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    return { balance: length % 2 === 0 ? 0 : firstPositive ? 1 : -1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 5, firstPositive: true },
  output: { balance: 1 },
} satisfies ToolExample<Input, Output>;
export const alternatingPrefixBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/alternating-prefix-balance",
    title: "Alternating Prefix Balance Tool",
    description:
      "Calculate alternating prefix balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        firstPositive: { type: "boolean" },
      },
      required: ["length", "firstPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { balance: { type: "integer" } },
      required: ["balance"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstPositive",
          label: "First Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "balance", label: "Balance", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = alternatingPrefixBalanceTool.execute;
export default alternatingPrefixBalanceTool;
