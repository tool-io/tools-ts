import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteIds: readonly string[];
  readonly duplicatePolicy: string;
};
export type Output = {
  readonly uniqueSites: number;
  readonly duplicates: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicatePolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["deduplicate", "keep-records"],
    },
  },
  required: ["siteIds", "duplicatePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueSites: { type: "integer" },
    duplicates: { type: "integer" },
    denominator: { type: "integer" },
  },
  required: ["uniqueSites", "duplicates", "denominator"],
} as const;
/** Audit duplicate supplied site IDs before selecting an observation denominator; no plaque score is interpreted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteIds, duplicatePolicy } = request;
  const compute = (): Output => {
    H.domain(["deduplicate", "keep-records"].includes(duplicatePolicy));
    const uniqueSites = new Set(siteIds).size;
    return {
      uniqueSites,
      duplicates: siteIds.length - uniqueSites,
      denominator:
        duplicatePolicy === "deduplicate" ? uniqueSites : siteIds.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siteIds: ["A", "B", "A"], duplicatePolicy: "deduplicate" },
  output: { uniqueSites: 2, duplicates: 1, denominator: 2 },
} satisfies ToolExample<Input, Output>;
export const plaqueCountDuplicateSiteTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/plaque-count-duplicate-site-token",
    title: "Plaque Count Duplicate Site Token Tool",
    description:
      "Audit duplicate supplied site IDs before selecting an observation denominator; no plaque score is interpreted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        duplicatePolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["deduplicate", "keep-records"],
        },
      },
      required: ["siteIds", "duplicatePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueSites: { type: "integer" },
        duplicates: { type: "integer" },
        denominator: { type: "integer" },
      },
      required: ["uniqueSites", "duplicates", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "siteIds",
          label: "Site Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "duplicatePolicy",
          label: "Duplicate Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "uniqueSites",
          label: "Unique Sites",
          valueType: { type: "integer" },
        },
        {
          id: "duplicates",
          label: "Duplicates",
          valueType: { type: "integer" },
        },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = plaqueCountDuplicateSiteTokenTool.execute;
export default plaqueCountDuplicateSiteTokenTool;
