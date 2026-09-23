import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly kmer: string };
export type Output = {
  readonly reverseComplement: string;
  readonly canonical: string;
  readonly palindromic: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kmer: { type: "string", maxLength: 8192 } },
  required: ["kmer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reverseComplement: { type: "string", maxLength: 8192 },
    canonical: { type: "string", maxLength: 8192 },
    palindromic: { type: "boolean" },
  },
  required: ["reverseComplement", "canonical", "palindromic"],
} as const;
/** Canonical uppercase DNA k-mer is the ASCII-lexicographically smaller of the k-mer and its reverse complement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { kmer } = request;
  const compute = (): Output => {
    H.domain(/^[ACGT]+(?![\s\S])/.test(kmer));
    const complement: Readonly<Record<string, string>> = {
        A: "T",
        C: "G",
        G: "C",
        T: "A",
      },
      reverseComplement = Array.from(kmer)
        .reverse()
        .map((c) => complement[c])
        .join("");
    return {
      reverseComplement,
      canonical: kmer < reverseComplement ? kmer : reverseComplement,
      palindromic: kmer === reverseComplement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { kmer: "ACG" },
  output: { reverseComplement: "CGT", canonical: "ACG", palindromic: false },
} satisfies ToolExample<Input, Output>;
export const kmerCanonicalReverseComplementPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/kmer-canonical-reverse-complement-pair",
    title: "Kmer Canonical Reverse Complement Pair Tool",
    description:
      "Canonical uppercase DNA k-mer is the ASCII-lexicographically smaller of the k-mer and its reverse complement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kmer: { type: "string", maxLength: 8192 } },
      required: ["kmer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reverseComplement: { type: "string", maxLength: 8192 },
        canonical: { type: "string", maxLength: 8192 },
        palindromic: { type: "boolean" },
      },
      required: ["reverseComplement", "canonical", "palindromic"],
    },
    ports: {
      inputs: [
        {
          id: "kmer",
          label: "Kmer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "reverseComplement",
          label: "Reverse Complement",
          valueType: { type: "string" },
        },
        { id: "canonical", label: "Canonical", valueType: { type: "string" } },
        {
          id: "palindromic",
          label: "Palindromic",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = kmerCanonicalReverseComplementPairTool.execute;
export default kmerCanonicalReverseComplementPairTool;
