import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citingAuthorIds: readonly string[];
  readonly citedAuthorIds: readonly string[];
};
export type Output = {
  readonly sharedAuthorIds: readonly string[];
  readonly hasAuthorOverlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citingAuthorIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    citedAuthorIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["citingAuthorIds", "citedAuthorIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedAuthorIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    hasAuthorOverlap: { type: "boolean" },
  },
  required: ["sharedAuthorIds", "hasAuthorOverlap"],
} as const;
/** Find exact shared author identifiers between a citing and cited work without resolving author names or classifying broader self-citation policies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citingAuthorIds, citedAuthorIds } = request;
  const compute = (): Output => {
    const sharedAuthorIds = [...new Set(citingAuthorIds)].filter((v) =>
      citedAuthorIds.includes(v),
    );
    return { sharedAuthorIds, hasAuthorOverlap: sharedAuthorIds.length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citingAuthorIds: ["A", "B"], citedAuthorIds: ["B", "C"] },
  output: { sharedAuthorIds: ["B"], hasAuthorOverlap: true },
} satisfies ToolExample<Input, Output>;
export const citationSelfAuthorOverlapFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/citation-self-author-overlap-flag",
    title: "Citation Self Author Overlap Flag",
    description:
      "Find exact shared author identifiers between a citing and cited work without resolving author names or classifying broader self-citation policies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citingAuthorIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        citedAuthorIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["citingAuthorIds", "citedAuthorIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedAuthorIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        hasAuthorOverlap: { type: "boolean" },
      },
      required: ["sharedAuthorIds", "hasAuthorOverlap"],
    },
    ports: {
      inputs: [
        {
          id: "citingAuthorIds",
          label: "Citing Author Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "citedAuthorIds",
          label: "Cited Author Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "sharedAuthorIds",
          label: "Shared Author Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "hasAuthorOverlap",
          label: "Has Author Overlap",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationSelfAuthorOverlapFlagTool.execute;
export default citationSelfAuthorOverlapFlagTool;
