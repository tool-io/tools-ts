import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codons: readonly string[];
  readonly residues: readonly string[];
  readonly residue: string;
};
export type Output = {
  readonly synonymousCodons: readonly string[];
  readonly degeneracy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    residues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    residue: { type: "string", maxLength: 8192 },
  },
  required: ["codons", "residues", "residue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    synonymousCodons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    degeneracy: { type: "integer" },
  },
  required: ["synonymousCodons", "degeneracy"],
} as const;
/** Count matching codons in an explicit caller-supplied genetic-code record; no organism-specific code is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codons, residues, residue } = request;
  const compute = (): Output => {
    H.sameLength(codons, residues);
    H.domain(
      new Set(codons).size === codons.length &&
        codons.every((c) => /^[ACGT]{3}(?![\s\S])/.test(c)),
    );
    const synonymousCodons = codons.filter((_, i) => residues[i] === residue);
    return { synonymousCodons, degeneracy: synonymousCodons.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    codons: ["AAA", "AAG", "AAC"],
    residues: ["K", "K", "N"],
    residue: "K",
  },
  output: { synonymousCodons: ["AAA", "AAG"], degeneracy: 2 },
} satisfies ToolExample<Input, Output>;
export const codonDegeneracySuppliedCodeRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/codon-degeneracy-supplied-code-record",
    title: "Codon Degeneracy Supplied Code Record Tool",
    description:
      "Count matching codons in an explicit caller-supplied genetic-code record; no organism-specific code is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        residues: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        residue: { type: "string", maxLength: 8192 },
      },
      required: ["codons", "residues", "residue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        synonymousCodons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        degeneracy: { type: "integer" },
      },
      required: ["synonymousCodons", "degeneracy"],
    },
    ports: {
      inputs: [
        {
          id: "codons",
          label: "Codons",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "residues",
          label: "Residues",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "residue",
          label: "Residue",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "synonymousCodons",
          label: "Synonymous Codons",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "degeneracy",
          label: "Degeneracy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = codonDegeneracySuppliedCodeRecordTool.execute;
export default codonDegeneracySuppliedCodeRecordTool;
