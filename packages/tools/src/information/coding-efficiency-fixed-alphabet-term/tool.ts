import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entropyBits: number;
  readonly averageSymbols: number;
  readonly alphabet: number;
};
export type Output = {
  readonly bitsPerCodeword: number;
  readonly efficiency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entropyBits: { type: "number", minimum: 0 },
    averageSymbols: { type: "number", exclusiveMinimum: 0 },
    alphabet: { type: "integer", minimum: 2 },
  },
  required: ["entropyBits", "averageSymbols", "alphabet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bitsPerCodeword: { type: "number" },
    efficiency: { type: "number" },
  },
  required: ["bitsPerCodeword", "efficiency"],
} as const;
/** Calculate coding efficiency fixed alphabet term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entropyBits, averageSymbols, alphabet } = request;
  const compute = (): Output => {
    H.domain(entropyBits >= 0);
    H.positive(averageSymbols);
    H.integer(alphabet, 2);
    const bitsPerCodeword = averageSymbols * Math.log2(alphabet);
    H.domain(entropyBits <= bitsPerCodeword);
    return { bitsPerCodeword, efficiency: entropyBits / bitsPerCodeword };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entropyBits: 3, averageSymbols: 2, alphabet: 4 },
  output: { bitsPerCodeword: 4, efficiency: 0.75 },
} satisfies ToolExample<Input, Output>;
export const codingEfficiencyFixedAlphabetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/coding-efficiency-fixed-alphabet-term",
    title: "Coding Efficiency Fixed Alphabet Term Tool",
    description:
      "Calculate coding efficiency fixed alphabet term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entropyBits: { type: "number", minimum: 0 },
        averageSymbols: { type: "number", exclusiveMinimum: 0 },
        alphabet: { type: "integer", minimum: 2 },
      },
      required: ["entropyBits", "averageSymbols", "alphabet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bitsPerCodeword: { type: "number" },
        efficiency: { type: "number" },
      },
      required: ["bitsPerCodeword", "efficiency"],
    },
    ports: {
      inputs: [
        {
          id: "entropyBits",
          label: "Entropy Bits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "averageSymbols",
          label: "Average Symbols",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alphabet",
          label: "Alphabet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "bitsPerCodeword",
          label: "Bits Per Codeword",
          valueType: { type: "number" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = codingEfficiencyFixedAlphabetTermTool.execute;
export default codingEfficiencyFixedAlphabetTermTool;
