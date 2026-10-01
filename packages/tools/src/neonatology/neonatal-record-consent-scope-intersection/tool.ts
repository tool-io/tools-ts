import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstScopes: readonly string[];
  readonly secondScopes: readonly string[];
  readonly firstWithdrawn: boolean;
  readonly secondWithdrawn: boolean;
};
export type Output = {
  readonly shared: readonly string[];
  readonly usable: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstWithdrawn: { type: "boolean" },
    secondWithdrawn: { type: "boolean" },
  },
  required: [
    "firstScopes",
    "secondScopes",
    "firstWithdrawn",
    "secondWithdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    usable: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["shared", "usable"],
} as const;
/** Intersect supplied scope tokens with explicit withdrawal flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstScopes, secondScopes, firstWithdrawn, secondWithdrawn } =
    request;
  const compute = (): Output => {
    H.domain(
      new Set(firstScopes).size === firstScopes.length &&
        new Set(secondScopes).size === secondScopes.length,
      "firstScopes",
    );
    const shared = firstScopes.filter((x) => secondScopes.includes(x));
    return { shared, usable: firstWithdrawn || secondWithdrawn ? [] : shared };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstScopes: ["research", "audit"],
    secondScopes: ["research"],
    firstWithdrawn: false,
    secondWithdrawn: false,
  },
  output: { shared: ["research"], usable: ["research"] },
} satisfies ToolExample<Input, Output>;
export const neonatalRecordConsentScopeIntersectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "neonatology/neonatal-record-consent-scope-intersection",
      title: "Neonatal Record Consent Scope Intersection Tool",
      description:
        "Intersect supplied scope tokens with explicit withdrawal flags.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstScopes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          secondScopes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          firstWithdrawn: { type: "boolean" },
          secondWithdrawn: { type: "boolean" },
        },
        required: [
          "firstScopes",
          "secondScopes",
          "firstWithdrawn",
          "secondWithdrawn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shared: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          usable: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["shared", "usable"],
      },
      ports: {
        inputs: [
          {
            id: "firstScopes",
            label: "First Scopes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "secondScopes",
            label: "Second Scopes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "firstWithdrawn",
            label: "First Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "secondWithdrawn",
            label: "Second Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "shared",
            label: "Shared",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "usable",
            label: "Usable",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = neonatalRecordConsentScopeIntersectionTool.execute;
export default neonatalRecordConsentScopeIntersectionTool;
