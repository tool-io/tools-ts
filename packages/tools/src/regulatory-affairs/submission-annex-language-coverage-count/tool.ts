import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: readonly string[];
  readonly supplied: readonly string[];
  readonly waived: readonly string[];
};
export type Output = {
  readonly missing: readonly string[];
  readonly covered: readonly string[];
  readonly waivedRequired: readonly string[];
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
    supplied: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    waived: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["required", "supplied", "waived"],
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
    covered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    waivedRequired: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missing", "covered", "waivedRequired"],
} as const;
/** Reconcile explicit required, supplied and waived annex languages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, supplied, waived } = request;
  const compute = (): Output => {
    H.domain(new Set(required).size === required.length);
    return {
      missing: required.filter(
        (x) => !supplied.includes(x) && !waived.includes(x),
      ),
      covered: required.filter((x) => supplied.includes(x)),
      waivedRequired: required.filter((x) => waived.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: ["en", "fr", "de"], supplied: ["en"], waived: ["de"] },
  output: { missing: ["fr"], covered: ["en"], waivedRequired: ["de"] },
} satisfies ToolExample<Input, Output>;
export const submissionAnnexLanguageCoverageCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/submission-annex-language-coverage-count",
      title: "Submission Annex Language Coverage Count Tool",
      description:
        "Reconcile explicit required, supplied and waived annex languages.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          required: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          supplied: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          waived: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["required", "supplied", "waived"],
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
          covered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          waivedRequired: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["missing", "covered", "waivedRequired"],
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
            id: "supplied",
            label: "Supplied",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "waived",
            label: "Waived",
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
            id: "covered",
            label: "Covered",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "waivedRequired",
            label: "Waived Required",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = submissionAnnexLanguageCoverageCountTool.execute;
export default submissionAnnexLanguageCoverageCountTool;
