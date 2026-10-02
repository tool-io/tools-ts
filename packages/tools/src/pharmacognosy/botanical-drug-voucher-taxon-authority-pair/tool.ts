import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly observedTaxon: string;
  readonly referenceTaxon: string;
  readonly authority: string;
  readonly edition: string;
};
export type Output = {
  readonly taxonMatches: boolean;
  readonly voucherKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192 },
    observedTaxon: { type: "string", maxLength: 8192 },
    referenceTaxon: { type: "string", maxLength: 8192 },
    authority: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: [
    "voucherId",
    "observedTaxon",
    "referenceTaxon",
    "authority",
    "edition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxonMatches: { type: "boolean" },
    voucherKey: { type: "string", maxLength: 8192 },
  },
  required: ["taxonMatches", "voucherKey"],
} as const;
/** Compare explicit voucher/taxon attribution without species identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, observedTaxon, referenceTaxon, authority, edition } =
    request;
  const compute = (): Output => {
    H.domain(
      [voucherId, observedTaxon, referenceTaxon, authority, edition].every(
        (x) => x.length > 0,
      ),
    );
    return {
      taxonMatches: observedTaxon === referenceTaxon,
      voucherKey: JSON.stringify([voucherId, authority, edition]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    voucherId: "V1",
    observedTaxon: "Taxon A",
    referenceTaxon: "Taxon A",
    authority: "registry-A",
    edition: "v1",
  },
  output: { taxonMatches: true, voucherKey: '["V1","registry-A","v1"]' },
} satisfies ToolExample<Input, Output>;
export const botanicalDrugVoucherTaxonAuthorityPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacognosy/botanical-drug-voucher-taxon-authority-pair",
      title: "Botanical Drug Voucher Taxon Authority Pair Tool",
      description:
        "Compare explicit voucher/taxon attribution without species identification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voucherId: { type: "string", maxLength: 8192 },
          observedTaxon: { type: "string", maxLength: 8192 },
          referenceTaxon: { type: "string", maxLength: 8192 },
          authority: { type: "string", maxLength: 8192 },
          edition: { type: "string", maxLength: 8192 },
        },
        required: [
          "voucherId",
          "observedTaxon",
          "referenceTaxon",
          "authority",
          "edition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          taxonMatches: { type: "boolean" },
          voucherKey: { type: "string", maxLength: 8192 },
        },
        required: ["taxonMatches", "voucherKey"],
      },
      ports: {
        inputs: [
          {
            id: "voucherId",
            label: "Voucher Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "observedTaxon",
            label: "Observed Taxon",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceTaxon",
            label: "Reference Taxon",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "authority",
            label: "Authority",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "edition",
            label: "Edition",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "taxonMatches",
            label: "Taxon Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "voucherKey",
            label: "Voucher Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = botanicalDrugVoucherTaxonAuthorityPairTool.execute;
export default botanicalDrugVoucherTaxonAuthorityPairTool;
