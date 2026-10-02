import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteTokens: readonly string[];
  readonly aliasTokens: readonly string[];
  readonly canonicalTokens: readonly string[];
  readonly suppliedSiteOrder: readonly string[];
};
export type Output = {
  readonly canonical: readonly string[];
  readonly orderIndices: readonly number[];
  readonly unknownPositions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    aliasTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    canonicalTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedSiteOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "siteTokens",
    "aliasTokens",
    "canonicalTokens",
    "suppliedSiteOrder",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonical: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    orderIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    unknownPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["canonical", "orderIndices", "unknownPositions"],
} as const;
/** Map supplied site aliases and order indices without inventing a clinical site convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteTokens, aliasTokens, canonicalTokens, suppliedSiteOrder } =
    request;
  const compute = (): Output => {
    H.sameLength(aliasTokens, canonicalTokens);
    H.domain(
      new Set(aliasTokens).size === aliasTokens.length &&
        new Set(suppliedSiteOrder).size === suppliedSiteOrder.length,
    );
    const canonical = siteTokens.map((x) => {
        const i = aliasTokens.indexOf(x);
        return i >= 0 ? canonicalTokens[i] : x;
      }),
      orderIndices = canonical.map((x) => suppliedSiteOrder.indexOf(x));
    return {
      canonical,
      orderIndices,
      unknownPositions: orderIndices.flatMap((x, i) => (x < 0 ? [i] : [])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    siteTokens: ["a", "B", "x"],
    aliasTokens: ["a"],
    canonicalTokens: ["A"],
    suppliedSiteOrder: ["A", "B"],
  },
  output: {
    canonical: ["A", "B", "x"],
    orderIndices: [0, 1, -1],
    unknownPositions: [2],
  },
} satisfies ToolExample<Input, Output>;
export const periodontalSiteAliasOrderTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/periodontal-site-alias-order-token",
    title: "Periodontal Site Alias Order Token Tool",
    description:
      "Map supplied site aliases and order indices without inventing a clinical site convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        aliasTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        canonicalTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedSiteOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "siteTokens",
        "aliasTokens",
        "canonicalTokens",
        "suppliedSiteOrder",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canonical: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        orderIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        unknownPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["canonical", "orderIndices", "unknownPositions"],
    },
    ports: {
      inputs: [
        {
          id: "siteTokens",
          label: "Site Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "aliasTokens",
          label: "Alias Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "canonicalTokens",
          label: "Canonical Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedSiteOrder",
          label: "Supplied Site Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "canonical",
          label: "Canonical",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "orderIndices",
          label: "Order Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "unknownPositions",
          label: "Unknown Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalSiteAliasOrderTokenTool.execute;
export default periodontalSiteAliasOrderTokenTool;
