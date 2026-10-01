import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly claimId: string;
  readonly citationId: string;
  readonly edition: string;
  readonly suppliedEvidencePresent: boolean;
};
export type Output = { readonly key: string; readonly linked: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192 },
    claimId: { type: "string", maxLength: 8192 },
    citationId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    suppliedEvidencePresent: { type: "boolean" },
  },
  required: [
    "productId",
    "claimId",
    "citationId",
    "edition",
    "suppliedEvidencePresent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    linked: { type: "boolean" },
  },
  required: ["key", "linked"],
} as const;
/** Record an explicit claim/citation link without evaluating the product claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, claimId, citationId, edition, suppliedEvidencePresent } =
    request;
  const compute = (): Output => {
    H.domain(
      [productId, claimId, citationId, edition].every((x) => x.length > 0),
    );
    return {
      key: JSON.stringify([productId, claimId, citationId, edition]),
      linked: suppliedEvidencePresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "P1",
    claimId: "C1",
    citationId: "R1",
    edition: "v1",
    suppliedEvidencePresent: true,
  },
  output: { key: '["P1","C1","R1","v1"]', linked: true },
} satisfies ToolExample<Input, Output>;
export const naturopathyProductClaimCitationLocatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "naturopathy/naturopathy-product-claim-citation-locator",
      title: "Naturopathy Product Claim Citation Locator Tool",
      description:
        "Record an explicit claim/citation link without evaluating the product claim.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productId: { type: "string", maxLength: 8192 },
          claimId: { type: "string", maxLength: 8192 },
          citationId: { type: "string", maxLength: 8192 },
          edition: { type: "string", maxLength: 8192 },
          suppliedEvidencePresent: { type: "boolean" },
        },
        required: [
          "productId",
          "claimId",
          "citationId",
          "edition",
          "suppliedEvidencePresent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string", maxLength: 8192 },
          linked: { type: "boolean" },
        },
        required: ["key", "linked"],
      },
      ports: {
        inputs: [
          {
            id: "productId",
            label: "Product Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "claimId",
            label: "Claim Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "citationId",
            label: "Citation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "edition",
            label: "Edition",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedEvidencePresent",
            label: "Supplied Evidence Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "key", label: "Key", valueType: { type: "string" } },
          { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = naturopathyProductClaimCitationLocatorTool.execute;
export default naturopathyProductClaimCitationLocatorTool;
