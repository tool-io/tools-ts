import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly bytes: readonly number[];
  readonly value: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bytes: { type: "array", maxItems: 256, items: { type: "integer" } },
    value: { type: "integer" },
  },
  required: ["bytes", "value"],
} as const;
/** Compute base45 pair triple group value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(token.length === 2 || token.length === 3);
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",
      digits = [...token].map((x) => alphabet.indexOf(x));
    domain(digits.every((x) => x >= 0));
    const value = digits.reduce((s, x, i) => s + x * 45 ** i, 0);
    domain(value < (token.length === 2 ? 256 : 65536));
    return {
      bytes:
        token.length === 2 ? [value] : [Math.floor(value / 256), value % 256],
      value,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "BB8" },
  output: { bytes: [65, 66], value: 16706 },
} satisfies ToolExample<Input, Output>;
export const base45PairTripleGroupValueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/base45-pair-triple-group-value",
  title: "Base45 Pair Triple Group Value Tool",
  description:
    "Compute base45 pair triple group value from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "bytes",
        label: "Bytes",
        valueType: { type: "list", items: { type: "integer" } },
      },
      { id: "value", label: "Value", valueType: { type: "integer" } },
    ],
  },
});
export const run = base45PairTripleGroupValueTool.execute;
export default base45PairTripleGroupValueTool;
