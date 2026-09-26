import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unit: string;
  readonly molecularForm: string;
  readonly expectedUnit: string;
  readonly expectedForm: string;
  readonly source: string;
};
export type Output = { readonly matches: boolean; readonly provenance: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unit: { type: "string", maxLength: 8192 },
    molecularForm: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
    expectedForm: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["unit", "molecularForm", "expectedUnit", "expectedForm", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    provenance: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "provenance"],
} as const;
/** Literal assay-unit/form provenance check without inventing hormone conversion factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unit, molecularForm, expectedUnit, expectedForm, source } = request;
  const compute = (): Output => {
    return {
      matches: unit === expectedUnit && molecularForm === expectedForm,
      provenance: JSON.stringify([source, unit, molecularForm]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    unit: "u1",
    molecularForm: "form-A",
    expectedUnit: "u1",
    expectedForm: "form-A",
    source: "lab",
  },
  output: { matches: true, provenance: '["lab","u1","form-A"]' },
} satisfies ToolExample<Input, Output>;
export const hormoneUnitFormReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/hormone-unit-form-reference-token",
    title: "Hormone Unit Form Reference Token Tool",
    description:
      "Literal assay-unit/form provenance check without inventing hormone conversion factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unit: { type: "string", maxLength: 8192 },
        molecularForm: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
        expectedForm: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: [
        "unit",
        "molecularForm",
        "expectedUnit",
        "expectedForm",
        "source",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        provenance: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "provenance"],
    },
    ports: {
      inputs: [
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "molecularForm",
          label: "Molecular Form",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUnit",
          label: "Expected Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedForm",
          label: "Expected Form",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "provenance",
          label: "Provenance",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = hormoneUnitFormReferenceTokenTool.execute;
export default hormoneUnitFormReferenceTokenTool;
