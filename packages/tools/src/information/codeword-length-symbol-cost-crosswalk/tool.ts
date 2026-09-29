import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly symbolCost: number };
export type Output = { readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    symbolCost: { type: "number", minimum: 0 },
  },
  required: ["length", "symbolCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cost: { type: "number" } },
  required: ["cost"],
} as const;
/** Calculate codeword length symbol cost crosswalk from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, symbolCost } = input;
  const compute = (): Output => {
    H.integer(length, 0);
    H.domain(symbolCost >= 0);
    return { cost: length * symbolCost };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 5, symbolCost: 2 },
  output: { cost: 10 },
} satisfies ToolExample<Input, Output>;
export const codewordLengthSymbolCostCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/codeword-length-symbol-cost-crosswalk",
    title: "Codeword Length Symbol Cost Crosswalk Tool",
    description:
      "Calculate codeword length symbol cost crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        symbolCost: { type: "number", minimum: 0 },
      },
      required: ["length", "symbolCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cost: { type: "number" } },
      required: ["cost"],
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
          id: "symbolCost",
          label: "Symbol Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "cost", label: "Cost", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = codewordLengthSymbolCostCrosswalkTool.execute;
export default codewordLengthSymbolCostCrosswalkTool;
