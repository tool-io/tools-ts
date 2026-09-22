import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bibliographyIds: readonly string[];
  readonly languageLabels: readonly string[];
  readonly targetLanguage: string;
};
export type Output = {
  readonly representedSources: number;
  readonly totalSources: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bibliographyIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    languageLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targetLanguage: { type: "string", maxLength: 8192 },
  },
  required: ["bibliographyIds", "languageLabels", "targetLanguage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    representedSources: { type: "integer" },
    totalSources: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["representedSources", "totalSources", "share", "defined"],
} as const;
/** Measure a supplied bounded regional bibliography’s source-language coverage, without inferring population language prevalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bibliographyIds, languageLabels, targetLanguage } = request;
  const compute = (): Output => {
    H.sameLength(bibliographyIds, languageLabels);
    H.domain(new Set(bibliographyIds).size === bibliographyIds.length);
    const representedSources = languageLabels.filter(
      (x) => x === targetLanguage,
    ).length;
    return {
      representedSources,
      totalSources: bibliographyIds.length,
      share:
        bibliographyIds.length > 0
          ? representedSources / bibliographyIds.length
          : 0,
      defined: bibliographyIds.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bibliographyIds: ["S1", "S2", "S3"],
    languageLabels: ["L1", "L2", "L1"],
    targetLanguage: "L1",
  },
  output: {
    representedSources: 2,
    totalSources: 3,
    share: 0.6666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const sourceLanguageCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/source-language-coverage-share",
    title: "Source Language Coverage Share Tool",
    description:
      "Measure a supplied bounded regional bibliography’s source-language coverage, without inferring population language prevalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bibliographyIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        languageLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targetLanguage: { type: "string", maxLength: 8192 },
      },
      required: ["bibliographyIds", "languageLabels", "targetLanguage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        representedSources: { type: "integer" },
        totalSources: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["representedSources", "totalSources", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "bibliographyIds",
          label: "Bibliography Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "languageLabels",
          label: "Language Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targetLanguage",
          label: "Target Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "representedSources",
          label: "Represented Sources",
          valueType: { type: "integer" },
        },
        {
          id: "totalSources",
          label: "Total Sources",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sourceLanguageCoverageShareTool.execute;
export default sourceLanguageCoverageShareTool;
