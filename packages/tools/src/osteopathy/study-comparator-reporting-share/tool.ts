import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFields: readonly string[];
  readonly supportedFields: readonly string[];
};
export type Output = {
  readonly supported: number;
  readonly required: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supportedFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredFields", "supportedFields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supported: { type: "integer" },
    required: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["supported", "required", "share", "defined"],
} as const;
/** Audit explicitly required comparator-description fields in supplied research reports without an efficacy implication. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFields, supportedFields } = request;
  const compute = (): Output => {
    return {
      supported: new Set(
        requiredFields.filter((x) => supportedFields.includes(x)),
      ).size,
      required: new Set(requiredFields).size,
      share: requiredFields.length
        ? new Set(requiredFields.filter((x) => supportedFields.includes(x)))
            .size / new Set(requiredFields).size
        : 0,
      defined: requiredFields.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredFields: ["design", "group"], supportedFields: ["design"] },
  output: { supported: 1, required: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const studyComparatorReportingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/study-comparator-reporting-share",
    title: "Study Comparator Reporting Share Tool",
    description:
      "Audit explicitly required comparator-description fields in supplied research reports without an efficacy implication.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supportedFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredFields", "supportedFields"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supported: { type: "integer" },
        required: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["supported", "required", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredFields",
          label: "Required Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supportedFields",
          label: "Supported Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "supported", label: "Supported", valueType: { type: "integer" } },
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = studyComparatorReportingShareTool.execute;
export default studyComparatorReportingShareTool;
