import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly remainder: number };
export type Output = { readonly symbol: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainder: { type: "integer", minimum: 0, maximum: 10 } },
  required: ["remainder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
/** Calculate issn numeric to x check symbol from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { remainder } = request;
  const compute = (): Output => {
    H.integer(remainder, 0, 10);
    const check = (11 - remainder) % 11;
    return { symbol: check === 10 ? "X" : String(check) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { remainder: 1 },
  output: { symbol: "X" },
} satisfies ToolExample<Input, Output>;
export const issnNumericToXCheckSymbolTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/issn-numeric-to-x-check-symbol",
    title: "ISSN Numeric To X Check Symbol Tool",
    description:
      "Calculate issn numeric to x check symbol from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainder: { type: "integer", minimum: 0, maximum: 10 } },
      required: ["remainder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    ports: {
      inputs: [
        {
          id: "remainder",
          label: "Remainder",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "symbol", label: "Symbol", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = issnNumericToXCheckSymbolTool.execute;
export default issnNumericToXCheckSymbolTool;
