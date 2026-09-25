import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxonCounts: readonly number[];
  readonly suppliedRareMaximum: number;
};
export type Output = {
  readonly totalCountDecimal: string;
  readonly rareCountDecimal: string;
  readonly rareTaxa: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxonCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    suppliedRareMaximum: { type: "integer", minimum: 0 },
  },
  required: ["taxonCounts", "suppliedRareMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    rareCountDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    rareTaxa: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "totalCountDecimal",
    "rareCountDecimal",
    "rareTaxa",
    "share",
    "defined",
  ],
} as const;
/** Use an explicit count cutoff for rarity bookkeeping; zero-count taxa are excluded from rare taxa. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxonCounts, suppliedRareMaximum } = request;
  const compute = (): Output => {
    H.integer(suppliedRareMaximum, 0);
    H.domain(taxonCounts.every((x) => x >= 0));
    return (() => {
      const total = taxonCounts.reduce((s, x) => s + BigInt(x), 0n),
        rare = taxonCounts.reduce(
          (s, x) => s + (x > 0 && x <= suppliedRareMaximum ? BigInt(x) : 0n),
          0n,
        );
      return {
        totalCountDecimal: total.toString(),
        rareCountDecimal: rare.toString(),
        rareTaxa: taxonCounts.filter((x) => x > 0 && x <= suppliedRareMaximum)
          .length,
        share: total > 0n ? Number(rare) / Number(total) : 0,
        defined: total > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taxonCounts: [1, 2, 5], suppliedRareMaximum: 2 },
  output: {
    totalCountDecimal: "8",
    rareCountDecimal: "3",
    rareTaxa: 2,
    share: 0.375,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const communityRareCountShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/community-rare-count-share",
    title: "Community Rare Count Share Tool",
    description:
      "Use an explicit count cutoff for rarity bookkeeping; zero-count taxa are excluded from rare taxa.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxonCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        suppliedRareMaximum: { type: "integer", minimum: 0 },
      },
      required: ["taxonCounts", "suppliedRareMaximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCountDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        rareCountDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        rareTaxa: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalCountDecimal",
        "rareCountDecimal",
        "rareTaxa",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "taxonCounts",
          label: "Taxon Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedRareMaximum",
          label: "Supplied Rare Maximum",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalCountDecimal",
          label: "Total Count Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "rareCountDecimal",
          label: "Rare Count Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "rareTaxa", label: "Rare Taxa", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = communityRareCountShareTool.execute;
export default communityRareCountShareTool;
