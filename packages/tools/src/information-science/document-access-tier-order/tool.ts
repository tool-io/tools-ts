import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentTier: string;
  readonly requesterTier: string;
  readonly suppliedOrder: readonly string[];
  readonly higherIndexAllowsLower: boolean;
};
export type Output = {
  readonly known: boolean;
  readonly allowedUnderOrder: boolean;
  readonly tierGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentTier: { type: "string", maxLength: 8192 },
    requesterTier: { type: "string", maxLength: 8192 },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    higherIndexAllowsLower: { type: "boolean" },
  },
  required: [
    "documentTier",
    "requesterTier",
    "suppliedOrder",
    "higherIndexAllowsLower",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    allowedUnderOrder: { type: "boolean" },
    tierGap: { type: "integer" },
  },
  required: ["known", "allowedUnderOrder", "tierGap"],
} as const;
/** Compare supplied access-tier tokens under an explicit ordering without granting access or establishing authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentTier, requesterTier, suppliedOrder, higherIndexAllowsLower } =
    request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    const d = suppliedOrder.indexOf(documentTier),
      r = suppliedOrder.indexOf(requesterTier),
      known = d >= 0 && r >= 0;
    return {
      known,
      allowedUnderOrder: known && (higherIndexAllowsLower ? r >= d : r <= d),
      tierGap: known ? r - d : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    documentTier: "staff",
    requesterTier: "admin",
    suppliedOrder: ["public", "staff", "admin"],
    higherIndexAllowsLower: true,
  },
  output: { known: true, allowedUnderOrder: true, tierGap: 1 },
} satisfies ToolExample<Input, Output>;
export const documentAccessTierOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/document-access-tier-order",
    title: "Document Access Tier Order Tool",
    description:
      "Compare supplied access-tier tokens under an explicit ordering without granting access or establishing authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentTier: { type: "string", maxLength: 8192 },
        requesterTier: { type: "string", maxLength: 8192 },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        higherIndexAllowsLower: { type: "boolean" },
      },
      required: [
        "documentTier",
        "requesterTier",
        "suppliedOrder",
        "higherIndexAllowsLower",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "boolean" },
        allowedUnderOrder: { type: "boolean" },
        tierGap: { type: "integer" },
      },
      required: ["known", "allowedUnderOrder", "tierGap"],
    },
    ports: {
      inputs: [
        {
          id: "documentTier",
          label: "Document Tier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requesterTier",
          label: "Requester Tier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "higherIndexAllowsLower",
          label: "Higher Index Allows Lower",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        {
          id: "allowedUnderOrder",
          label: "Allowed Under Order",
          valueType: { type: "boolean" },
        },
        { id: "tierGap", label: "Tier Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = documentAccessTierOrderTool.execute;
export default documentAccessTierOrderTool;
