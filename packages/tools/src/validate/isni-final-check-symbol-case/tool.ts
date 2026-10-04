import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly symbol: string };
export type Output = { readonly normalized: string; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string", maxLength: 8192 },
    valid: { type: "boolean" },
  },
  required: ["normalized", "valid"],
} as const;
/** Calculate isni final check symbol case from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbol } = request;
  const compute = (): Output => {
    const normalized = symbol === "x" ? "X" : symbol;
    return { normalized, valid: /^[0-9X](?![\s\S])/.test(normalized) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbol: "x" },
  output: { normalized: "X", valid: true },
} satisfies ToolExample<Input, Output>;
export const isniFinalCheckSymbolCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/isni-final-check-symbol-case",
    title: "ISNI Final Check Symbol Case Tool",
    description:
      "Calculate isni final check symbol case from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "string", maxLength: 8192 },
        valid: { type: "boolean" },
      },
      required: ["normalized", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "string" },
        },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = isniFinalCheckSymbolCaseTool.execute;
export default isniFinalCheckSymbolCaseTool;
