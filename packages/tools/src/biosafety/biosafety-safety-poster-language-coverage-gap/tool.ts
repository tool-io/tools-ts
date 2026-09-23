import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: readonly string[];
  readonly published: readonly string[];
  readonly verifiedTranslation: readonly string[];
};
export type Output = {
  readonly missing: readonly string[];
  readonly unverified: readonly string[];
  readonly complete: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    published: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiedTranslation: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["required", "published", "verifiedTranslation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unverified: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    complete: { type: "boolean" },
  },
  required: ["missing", "unverified", "complete"],
} as const;
/** Audit explicit poster language and translation-review records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, published, verifiedTranslation } = request;
  const compute = (): Output => {
    H.domain(new Set(required).size === required.length);
    const missing = required.filter((x) => !published.includes(x)),
      unverified = required.filter(
        (x) => published.includes(x) && !verifiedTranslation.includes(x),
      );
    return {
      missing,
      unverified,
      complete: missing.length === 0 && unverified.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    required: ["en", "fr", "de"],
    published: ["en", "fr"],
    verifiedTranslation: ["en"],
  },
  output: { missing: ["de"], unverified: ["fr"], complete: false },
} satisfies ToolExample<Input, Output>;
export const biosafetySafetyPosterLanguageCoverageGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-safety-poster-language-coverage-gap",
      title: "Biosafety Safety Poster Language Coverage Gap Tool",
      description:
        "Audit explicit poster language and translation-review records.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          required: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          published: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          verifiedTranslation: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["required", "published", "verifiedTranslation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missing: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unverified: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          complete: { type: "boolean" },
        },
        required: ["missing", "unverified", "complete"],
      },
      ports: {
        inputs: [
          {
            id: "required",
            label: "Required",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "published",
            label: "Published",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "verifiedTranslation",
            label: "Verified Translation",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "missing",
            label: "Missing",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unverified",
            label: "Unverified",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "complete", label: "Complete", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosafetySafetyPosterLanguageCoverageGapTool.execute;
export default biosafetySafetyPosterLanguageCoverageGapTool;
