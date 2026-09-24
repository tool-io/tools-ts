import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldIds: readonly string[];
  readonly formValues: readonly string[];
  readonly sourceValues: readonly string[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly fields: number;
  readonly valueMismatches: number;
  readonly verifiedMatches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    formValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceValues: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["fieldIds", "formValues", "sourceValues", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fields: { type: "integer" },
    valueMismatches: { type: "integer" },
    verifiedMatches: { type: "integer" },
  },
  required: ["fields", "valueMismatches", "verifiedMatches"],
} as const;
/** Calculate research form source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldIds, formValues, sourceValues, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(fieldIds, formValues);
    H.sameLength(fieldIds, sourceValues);
    H.sameLength(fieldIds, sourceVerified);
    H.domain(new Set(fieldIds).size === fieldIds.length);
    return {
      fields: fieldIds.length,
      valueMismatches: formValues.filter((x, i) => x !== sourceValues[i])
        .length,
      verifiedMatches: fieldIds.filter(
        (x, i) => formValues[i] === sourceValues[i] && sourceVerified[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldIds: ["a", "b"],
    formValues: ["1", "2"],
    sourceValues: ["1", "3"],
    sourceVerified: [true, true],
  },
  output: { fields: 2, valueMismatches: 1, verifiedMatches: 1 },
} satisfies ToolExample<Input, Output>;
export const researchFormSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/research-form-source-gap",
    title: "Research Form Source Gap Tool",
    description:
      "Calculate research form source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        formValues: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceValues: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["fieldIds", "formValues", "sourceValues", "sourceVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fields: { type: "integer" },
        valueMismatches: { type: "integer" },
        verifiedMatches: { type: "integer" },
      },
      required: ["fields", "valueMismatches", "verifiedMatches"],
    },
    ports: {
      inputs: [
        {
          id: "fieldIds",
          label: "Field Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "formValues",
          label: "Form Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceValues",
          label: "Source Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "fields", label: "Fields", valueType: { type: "integer" } },
        {
          id: "valueMismatches",
          label: "Value Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedMatches",
          label: "Verified Matches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchFormSourceGapTool.execute;
export default researchFormSourceGapTool;
