import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly declaredScopes: readonly string[];
  readonly decisionScopes: readonly string[];
};
export type Output = {
  readonly overlappingScopes: readonly string[];
  readonly overlapCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    declaredScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    decisionScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["declaredScopes", "decisionScopes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlappingScopes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    overlapCount: { type: "integer" },
  },
  required: ["overlappingScopes", "overlapCount"],
} as const;
/** Inspect exact supplied interest-scope overlaps without determining a conflict or recusal duty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { declaredScopes, decisionScopes } = request;
  const compute = (): Output => {
    const overlappingScopes = [...new Set(declaredScopes)].filter((x) =>
      decisionScopes.includes(x),
    );
    return { overlappingScopes, overlapCount: overlappingScopes.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    declaredScopes: ["funding", "board", "board"],
    decisionScopes: ["board", "hiring"],
  },
  output: { overlappingScopes: ["board"], overlapCount: 1 },
} satisfies ToolExample<Input, Output>;
export const declaredInterestScopeOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/declared-interest-scope-overlap",
    title: "Declared Interest Scope Overlap Tool",
    description:
      "Inspect exact supplied interest-scope overlaps without determining a conflict or recusal duty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        declaredScopes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        decisionScopes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["declaredScopes", "decisionScopes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlappingScopes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        overlapCount: { type: "integer" },
      },
      required: ["overlappingScopes", "overlapCount"],
    },
    ports: {
      inputs: [
        {
          id: "declaredScopes",
          label: "Declared Scopes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "decisionScopes",
          label: "Decision Scopes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "overlappingScopes",
          label: "Overlapping Scopes",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "overlapCount",
          label: "Overlap Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = declaredInterestScopeOverlapTool.execute;
export default declaredInterestScopeOverlapTool;
