import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly childRank: string;
  readonly parentRank: string;
  readonly allowedChildren: readonly string[];
  readonly allowedParents: readonly string[];
};
export type Output = {
  readonly matches: boolean;
  readonly matchingIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childRank: { type: "string", maxLength: 8192 },
    parentRank: { type: "string", maxLength: 8192 },
    allowedChildren: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedParents: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["childRank", "parentRank", "allowedChildren", "allowedParents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    matchingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["matches", "matchingIndices"],
} as const;
/** Check a supplied taxonomic rank pair against explicit parent rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { childRank, parentRank, allowedChildren, allowedParents } = request;
  const compute = (): Output => {
    H.sameLength(allowedChildren, allowedParents);
    const matchingIndices = allowedChildren.flatMap((x, i) =>
      x === childRank && allowedParents[i] === parentRank ? [i] : [],
    );
    return { matches: matchingIndices.length > 0, matchingIndices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    childRank: "species",
    parentRank: "genus",
    allowedChildren: ["species", "genus"],
    allowedParents: ["genus", "family"],
  },
  output: { matches: true, matchingIndices: [0] },
} satisfies ToolExample<Input, Output>;
export const taxonRankSuppliedParentMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-rank-supplied-parent-match",
    title: "Taxon Rank Supplied Parent Match Tool",
    description:
      "Check a supplied taxonomic rank pair against explicit parent rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        childRank: { type: "string", maxLength: 8192 },
        parentRank: { type: "string", maxLength: 8192 },
        allowedChildren: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allowedParents: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "childRank",
        "parentRank",
        "allowedChildren",
        "allowedParents",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        matchingIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["matches", "matchingIndices"],
    },
    ports: {
      inputs: [
        {
          id: "childRank",
          label: "Child Rank",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentRank",
          label: "Parent Rank",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedChildren",
          label: "Allowed Children",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allowedParents",
          label: "Allowed Parents",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "matchingIndices",
          label: "Matching Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonRankSuppliedParentMatchTool.execute;
export default taxonRankSuppliedParentMatchTool;
