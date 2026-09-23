import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly symbol: string };
export type Output = {
  readonly bases: readonly string[];
  readonly cardinality: number;
};
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
    bases: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    cardinality: { type: "integer" },
  },
  required: ["bases", "cardinality"],
} as const;
/** Uppercase IUPAC DNA ambiguity codes, excluding RNA U, gaps and unknown punctuation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbol } = request;
  const compute = (): Output => {
    const table: Readonly<Record<string, string>> = {
      A: "A",
      C: "C",
      G: "G",
      T: "T",
      R: "AG",
      Y: "CT",
      S: "CG",
      W: "AT",
      K: "GT",
      M: "AC",
      B: "CGT",
      D: "AGT",
      H: "ACT",
      V: "ACG",
      N: "ACGT",
    };
    H.domain(Object.hasOwn(table, symbol));
    const bases = Array.from(table[symbol]);
    return { bases, cardinality: bases.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbol: "R" },
  output: { bases: ["A", "G"], cardinality: 2 },
} satisfies ToolExample<Input, Output>;
export const fastaIupacAmbiguityCardinalityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/fasta-iupac-ambiguity-cardinality",
    title: "FASTA Iupac Ambiguity Cardinality Tool",
    description:
      "Uppercase IUPAC DNA ambiguity codes, excluding RNA U, gaps and unknown punctuation.",
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
        bases: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        cardinality: { type: "integer" },
      },
      required: ["bases", "cardinality"],
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
          id: "bases",
          label: "Bases",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "cardinality",
          label: "Cardinality",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fastaIupacAmbiguityCardinalityTool.execute;
export default fastaIupacAmbiguityCardinalityTool;
