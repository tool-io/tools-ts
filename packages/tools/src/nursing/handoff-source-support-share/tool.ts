import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFields: readonly string[];
  readonly fieldSources: readonly string[];
  readonly verifiedSources: readonly string[];
};
export type Output = {
  readonly requiredFieldsCount: number;
  readonly fieldsWithSource: number;
  readonly verifiedFields: number;
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
    fieldSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiedSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredFields", "fieldSources", "verifiedSources"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFieldsCount: { type: "integer" },
    fieldsWithSource: { type: "integer" },
    verifiedFields: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "requiredFieldsCount",
    "fieldsWithSource",
    "verifiedFields",
    "share",
    "defined",
  ],
} as const;
/** Calculate handoff source support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFields, fieldSources, verifiedSources } = request;
  const compute = (): Output => {
    H.sameLength(requiredFields, fieldSources);
    H.domain(new Set(requiredFields).size === requiredFields.length);
    return (() => {
      const fieldsWithSource = fieldSources.filter((x) => x.length > 0).length,
        verifiedFields = fieldSources.filter(
          (x) => x.length > 0 && verifiedSources.includes(x),
        ).length;
      return {
        requiredFieldsCount: requiredFields.length,
        fieldsWithSource,
        verifiedFields,
        share:
          requiredFields.length > 0
            ? verifiedFields / requiredFields.length
            : 0,
        defined: requiredFields.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredFields: ["a", "b"],
    fieldSources: ["s1", "s2"],
    verifiedSources: ["s1"],
  },
  output: {
    requiredFieldsCount: 2,
    fieldsWithSource: 2,
    verifiedFields: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const handoffSourceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/handoff-source-support-share",
    title: "Handoff Source Support Share Tool",
    description:
      "Calculate handoff source support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        fieldSources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        verifiedSources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredFields", "fieldSources", "verifiedSources"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFieldsCount: { type: "integer" },
        fieldsWithSource: { type: "integer" },
        verifiedFields: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "requiredFieldsCount",
        "fieldsWithSource",
        "verifiedFields",
        "share",
        "defined",
      ],
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
          id: "fieldSources",
          label: "Field Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "verifiedSources",
          label: "Verified Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "requiredFieldsCount",
          label: "Required Fields Count",
          valueType: { type: "integer" },
        },
        {
          id: "fieldsWithSource",
          label: "Fields With Source",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedFields",
          label: "Verified Fields",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = handoffSourceSupportShareTool.execute;
export default handoffSourceSupportShareTool;
