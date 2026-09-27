import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codon: string;
  readonly codeCodons: readonly string[];
  readonly aminoAcids: readonly string[];
  readonly neighborCodons: readonly string[];
  readonly neighborWeights: readonly number[];
  readonly excludedAminoAcidTokens: readonly string[];
};
export type Output = {
  readonly synonymousMask: readonly boolean[];
  readonly siteOpportunity: readonly number[];
  readonly totalOpportunity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codon: { type: "string", maxLength: 8192 },
    codeCodons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    aminoAcids: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    neighborCodons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    neighborWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    excludedAminoAcidTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "codon",
    "codeCodons",
    "aminoAcids",
    "neighborCodons",
    "neighborWeights",
    "excludedAminoAcidTokens",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    synonymousMask: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    siteOpportunity: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    totalOpportunity: { type: "number" },
  },
  required: ["synonymousMask", "siteOpportunity", "totalOpportunity"],
} as const;
/** Evaluate caller-verified genetic-code labels, excluded stop/unknown labels and explicitly weighted unique substitution neighbors; no universal code or mutation convention is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    codon,
    codeCodons,
    aminoAcids,
    neighborCodons,
    neighborWeights,
    excludedAminoAcidTokens,
  } = request;
  const compute = (): Output => {
    H.sameLength(codeCodons, aminoAcids);
    H.sameLength(neighborCodons, neighborWeights);
    H.domain(
      /^[ACGT]{3}(?![\s\S])/.test(codon) &&
        new Set(codeCodons).size === codeCodons.length &&
        codeCodons.every((x) => /^[ACGT]{3}(?![\s\S])/.test(x)) &&
        neighborWeights.every((x) => x >= 0),
    );
    H.domain(
      aminoAcids.every((x) => x.length > 0) &&
        new Set(neighborCodons).size === neighborCodons.length,
      "aminoAcids",
    );
    const base = codeCodons.indexOf(codon);
    H.domain(
      base >= 0 && !excludedAminoAcidTokens.includes(aminoAcids[base]),
      "codon",
      "Provide an included amino-acid codon under the supplied code convention.",
    );
    const siteOpportunity = [0, 0, 0],
      synonymousMask = neighborCodons.map((n, k) => {
        H.domain(/^[ACGT]{3}(?![\s\S])/.test(n));
        const changed = [0, 1, 2].filter((i) => n[i] !== codon[i]),
          j = codeCodons.indexOf(n);
        H.domain(changed.length === 1 && j >= 0);
        const same =
          aminoAcids[j] === aminoAcids[base] &&
          !excludedAminoAcidTokens.includes(aminoAcids[j]);
        if (same) siteOpportunity[changed[0]] += neighborWeights[k];
        return same;
      });
    return {
      synonymousMask,
      siteOpportunity,
      totalOpportunity: siteOpportunity.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    codon: "GCT",
    codeCodons: ["GCT", "GCC", "GAT"],
    aminoAcids: ["A", "A", "D"],
    neighborCodons: ["GCC", "GAT"],
    neighborWeights: [0.5, 0.5],
    excludedAminoAcidTokens: ["*"],
  },
  output: {
    synonymousMask: [true, false],
    siteOpportunity: [0, 0, 0.5],
    totalOpportunity: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const codonSynonymousSiteMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/codon-synonymous-site-mask",
    title: "Codon Synonymous Site Mask Tool",
    description:
      "Evaluate caller-verified genetic-code labels, excluded stop/unknown labels and explicitly weighted unique substitution neighbors; no universal code or mutation convention is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codon: { type: "string", maxLength: 8192 },
        codeCodons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        aminoAcids: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        neighborCodons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        neighborWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        excludedAminoAcidTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "codon",
        "codeCodons",
        "aminoAcids",
        "neighborCodons",
        "neighborWeights",
        "excludedAminoAcidTokens",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        synonymousMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        siteOpportunity: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        totalOpportunity: { type: "number" },
      },
      required: ["synonymousMask", "siteOpportunity", "totalOpportunity"],
    },
    ports: {
      inputs: [
        {
          id: "codon",
          label: "Codon",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeCodons",
          label: "Code Codons",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "aminoAcids",
          label: "Amino Acids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "neighborCodons",
          label: "Neighbor Codons",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "neighborWeights",
          label: "Neighbor Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedAminoAcidTokens",
          label: "Excluded Amino Acid Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "synonymousMask",
          label: "Synonymous Mask",
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "siteOpportunity",
          label: "Site Opportunity",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "totalOpportunity",
          label: "Total Opportunity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = codonSynonymousSiteMaskTool.execute;
export default codonSynonymousSiteMaskTool;
