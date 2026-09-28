import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldDiameter: number;
  readonly suppliedLengthUnitFactor: number;
  readonly fields: number;
  readonly excludedFields: number;
};
export type Output = {
  readonly singleArea: number;
  readonly totalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldDiameter: { type: "number", minimum: 0 },
    suppliedLengthUnitFactor: { type: "number", exclusiveMinimum: 0 },
    fields: { type: "integer", minimum: 0 },
    excludedFields: { type: "integer", minimum: 0 },
  },
  required: [
    "fieldDiameter",
    "suppliedLengthUnitFactor",
    "fields",
    "excludedFields",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { singleArea: { type: "number" }, totalArea: { type: "number" } },
  required: ["singleArea", "totalArea"],
} as const;
/** Circular supplied research field geometry without cell classification or diagnostic counting guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldDiameter, suppliedLengthUnitFactor, fields, excludedFields } =
    request;
  const compute = (): Output => {
    H.domain(fieldDiameter >= 0);
    H.positive(suppliedLengthUnitFactor);
    H.integer(fields, 0);
    H.integer(excludedFields, 0, fields);
    return {
      singleArea:
        Math.PI * ((fieldDiameter * suppliedLengthUnitFactor) / 2) ** 2,
      totalArea:
        Math.PI *
        ((fieldDiameter * suppliedLengthUnitFactor) / 2) ** 2 *
        (fields - excludedFields),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldDiameter: 2,
    suppliedLengthUnitFactor: 1,
    fields: 10,
    excludedFields: 2,
  },
  output: { singleArea: 3.141592653589793, totalArea: 25.132741228718345 },
} satisfies ToolExample<Input, Output>;
export const researchSmearFieldAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/research-smear-field-area",
    title: "Research Smear Field Area Tool",
    description:
      "Circular supplied research field geometry without cell classification or diagnostic counting guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldDiameter: { type: "number", minimum: 0 },
        suppliedLengthUnitFactor: { type: "number", exclusiveMinimum: 0 },
        fields: { type: "integer", minimum: 0 },
        excludedFields: { type: "integer", minimum: 0 },
      },
      required: [
        "fieldDiameter",
        "suppliedLengthUnitFactor",
        "fields",
        "excludedFields",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        singleArea: { type: "number" },
        totalArea: { type: "number" },
      },
      required: ["singleArea", "totalArea"],
    },
    ports: {
      inputs: [
        {
          id: "fieldDiameter",
          label: "Field Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLengthUnitFactor",
          label: "Supplied Length Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fields",
          label: "Fields",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedFields",
          label: "Excluded Fields",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "singleArea",
          label: "Single Area",
          valueType: { type: "number" },
        },
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchSmearFieldAreaTool.execute;
export default researchSmearFieldAreaTool;
