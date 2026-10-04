import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly symbol: string };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Compute issn x to ten value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    domain(/^[0-9X](?![\s\S])/.test(symbol));
    return { value: symbol === "X" ? 10 : Number(symbol) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "X" },
  output: { value: 10 },
} satisfies ToolExample<Input, Output>;
export const issnXToTenValueTool = defineSchemaCalculation<Input, Output>({
  id: "validate/issn-x-to-ten-value",
  title: "ISSN X To Ten Value Tool",
  description: "Compute issn x to ten value from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "symbol",
        label: "Symbol",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "integer" } }],
  },
});
export const run = issnXToTenValueTool.execute;
export default issnXToTenValueTool;
