import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string; readonly zeroSymbol: string };
export type Output = { readonly count: number; readonly suffix: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    zeroSymbol: { type: "string", maxLength: 8192 },
  },
  required: ["token", "zeroSymbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["count", "suffix"],
} as const;
/** Compute base n leading zero symbol count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token, zeroSymbol } = input;
  const compute = (): Output => {
    domain([...zeroSymbol].length === 1);
    const chars = [...token];
    let count = 0;
    while (chars[count] === zeroSymbol) count++;
    return { count, suffix: chars.slice(count).join("") };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "111abc", zeroSymbol: "1" },
  output: { count: 3, suffix: "abc" },
} satisfies ToolExample<Input, Output>;
export const baseNLeadingZeroSymbolCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/base-n-leading-zero-symbol-count",
  title: "Base N Leading Zero Symbol Count Tool",
  description:
    "Compute base n leading zero symbol count from explicit bounded inputs.",
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
      {
        id: "zeroSymbol",
        label: "Zero Symbol",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "count", label: "Count", valueType: { type: "integer" } },
      { id: "suffix", label: "Suffix", valueType: { type: "string" } },
    ],
  },
});
export const run = baseNLeadingZeroSymbolCountTool.execute;
export default baseNLeadingZeroSymbolCountTool;
