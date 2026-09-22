import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly matrix: string;
  readonly unit: string;
  readonly expectedMatrix: string;
  readonly expectedUnit: string;
  readonly source: string;
};
export type Output = { readonly matches: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matrix: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192 },
    expectedMatrix: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["matrix", "unit", "expectedMatrix", "expectedUnit", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "key"],
} as const;
/** Compare explicit matrix/unit attribution without inferring specimen equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { matrix, unit, expectedMatrix, expectedUnit, source } = request;
  const compute = (): Output => {
    return {
      matches: matrix === expectedMatrix && unit === expectedUnit,
      key: JSON.stringify([source, matrix, unit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    matrix: "serum",
    unit: "mg/L",
    expectedMatrix: "serum",
    expectedUnit: "mg/L",
    source: "lab-A",
  },
  output: { matches: true, key: '["lab-A","serum","mg/L"]' },
} satisfies ToolExample<Input, Output>;
export const biobankSpecimenMatrixUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-specimen-matrix-unit-pair",
    title: "Biobank Specimen Matrix Unit Pair Tool",
    description:
      "Compare explicit matrix/unit attribution without inferring specimen equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matrix: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192 },
        expectedMatrix: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["matrix", "unit", "expectedMatrix", "expectedUnit", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "key"],
    },
    ports: {
      inputs: [
        {
          id: "matrix",
          label: "Matrix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedMatrix",
          label: "Expected Matrix",
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
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = biobankSpecimenMatrixUnitPairTool.execute;
export default biobankSpecimenMatrixUnitPairTool;
