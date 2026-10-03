import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLanguages: readonly string[];
  readonly supportedLanguages: readonly string[];
};
export type Output = {
  readonly requiredCount: number;
  readonly supportedRequiredCount: number;
  readonly missingLanguages: readonly string[];
  readonly coverage: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supportedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredLanguages", "supportedLanguages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    supportedRequiredCount: { type: "integer" },
    missingLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    coverage: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "requiredCount",
    "supportedRequiredCount",
    "missingLanguages",
    "coverage",
    "defined",
  ],
} as const;
/** Compare one public notice package’s supplied language support against its explicit required language list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredLanguages, supportedLanguages } = request;
  const compute = (): Output => {
    const unique = [...new Set(requiredLanguages)],
      missingLanguages = unique.filter((x) => !supportedLanguages.includes(x)),
      requiredCount = unique.length,
      supportedRequiredCount = requiredCount - missingLanguages.length;
    return {
      requiredCount,
      supportedRequiredCount,
      missingLanguages,
      coverage: requiredCount > 0 ? supportedRequiredCount / requiredCount : 0,
      defined: requiredCount > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredLanguages: ["L1", "L2", "L3", "L3"],
    supportedLanguages: ["L1", "L3"],
  },
  output: {
    requiredCount: 3,
    supportedRequiredCount: 2,
    missingLanguages: ["L2"],
    coverage: 0.6666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const noticeLanguageCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/notice-language-coverage-share",
    title: "Notice Language Coverage Share Tool",
    description:
      "Compare one public notice package’s supplied language support against its explicit required language list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supportedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredLanguages", "supportedLanguages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer" },
        supportedRequiredCount: { type: "integer" },
        missingLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        coverage: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "requiredCount",
        "supportedRequiredCount",
        "missingLanguages",
        "coverage",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "requiredLanguages",
          label: "Required Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supportedLanguages",
          label: "Supported Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "supportedRequiredCount",
          label: "Supported Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingLanguages",
          label: "Missing Languages",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = noticeLanguageCoverageShareTool.execute;
export default noticeLanguageCoverageShareTool;
