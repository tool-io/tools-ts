import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citationIds: readonly string[];
  readonly originGroupIds: readonly string[];
};
export type Output = {
  readonly citationCount: number;
  readonly originGroupCount: number;
  readonly sharedOriginCitations: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citationIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    originGroupIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["citationIds", "originGroupIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citationCount: { type: "integer" },
    originGroupCount: { type: "integer" },
    sharedOriginCitations: { type: "integer" },
  },
  required: ["citationCount", "originGroupCount", "sharedOriginCitations"],
} as const;
/** Count explicitly assigned citation-origin groups without inferring factual or statistical independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citationIds, originGroupIds } = request;
  const compute = (): Output => {
    H.domain(citationIds.length === originGroupIds.length, "originGroupIds");
    H.domain(
      new Set(citationIds).size === citationIds.length &&
        citationIds.every((v) => v.length > 0),
      "citationIds",
    );
    H.domain(
      originGroupIds.every((v) => v.length > 0),
      "originGroupIds",
    );
    return {
      citationCount: citationIds.length,
      originGroupCount: new Set(originGroupIds).size,
      sharedOriginCitations: citationIds.length - new Set(originGroupIds).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citationIds: ["A", "B", "C"], originGroupIds: ["X", "X", "Y"] },
  output: { citationCount: 3, originGroupCount: 2, sharedOriginCitations: 1 },
} satisfies ToolExample<Input, Output>;
export const citationIndependentSourceCountPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["epistemology", "philosophy"],
      keywords: ["epistemology", "philosophy"],
    },
    id: "epistemology/citation-independent-source-count-pair",
    title: "Citation Independent Source Count Pair",
    description:
      "Count explicitly assigned citation-origin groups without inferring factual or statistical independence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citationIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        originGroupIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["citationIds", "originGroupIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citationCount: { type: "integer" },
        originGroupCount: { type: "integer" },
        sharedOriginCitations: { type: "integer" },
      },
      required: ["citationCount", "originGroupCount", "sharedOriginCitations"],
    },
    ports: {
      inputs: [
        {
          id: "citationIds",
          label: "Citation Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "originGroupIds",
          label: "Origin Group Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "citationCount",
          label: "Citation Count",
          valueType: { type: "integer" },
        },
        {
          id: "originGroupCount",
          label: "Origin Group Count",
          valueType: { type: "integer" },
        },
        {
          id: "sharedOriginCitations",
          label: "Shared Origin Citations",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationIndependentSourceCountPairTool.execute;
export default citationIndependentSourceCountPairTool;
