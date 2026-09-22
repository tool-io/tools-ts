import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstScopes: readonly string[];
  readonly secondScopes: readonly string[];
};
export type Output = { readonly sharedScopeCount: number };
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
  },
  required: ["firstScopes", "secondScopes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sharedScopeCount: { type: "integer" } },
  required: ["sharedScopeCount"],
} as const;
/** Count distinct exact tokens shared by two explicitly supplied consent-scope lists without interpreting legal validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstScopes, secondScopes } = request;
  const compute = (): Output => {
    return {
      sharedScopeCount: new Set(
        firstScopes.filter((x) => secondScopes.includes(x)),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstScopes: ["a", "b", "b"], secondScopes: ["b", "c"] },
  output: { sharedScopeCount: 1 },
} satisfies ToolExample<Input, Output>;
export const consentScopeIntersectionSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-scope-intersection-size",
    title: "Consent Scope Intersection Size Tool",
    description:
      "Count distinct exact tokens shared by two explicitly supplied consent-scope lists without interpreting legal validity.",
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
      },
      required: ["firstScopes", "secondScopes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sharedScopeCount: { type: "integer" } },
      required: ["sharedScopeCount"],
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
      ],
      outputs: [
        {
          id: "sharedScopeCount",
          label: "Shared Scope Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentScopeIntersectionSizeTool.execute;
export default consentScopeIntersectionSizeTool;
