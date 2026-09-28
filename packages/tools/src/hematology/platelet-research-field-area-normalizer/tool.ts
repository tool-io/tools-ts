import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly fields: number;
  readonly fieldArea: number;
  readonly referenceArea: number;
};
export type Output = {
  readonly sampledArea: number;
  readonly perArea: number;
  readonly referenceCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "integer", minimum: 0 },
    fields: { type: "integer", minimum: 1 },
    fieldArea: { type: "number", exclusiveMinimum: 0 },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "fields", "fieldArea", "referenceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledArea: { type: "number" },
    perArea: { type: "number" },
    referenceCount: { type: "number" },
  },
  required: ["sampledArea", "perArea", "referenceCount"],
} as const;
/** Observed platelets per supplied imaged area, not an inferred blood concentration or platelet estimate multiplier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, fields, fieldArea, referenceArea } = request;
  const compute = (): Output => {
    H.integer(observed, 0);
    H.integer(fields, 1);
    H.positive(fieldArea);
    H.positive(referenceArea);
    return {
      sampledArea: fields * fieldArea,
      perArea: observed / (fields * fieldArea),
      referenceCount: (observed * referenceArea) / (fields * fieldArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 40, fields: 10, fieldArea: 0.2, referenceArea: 1 },
  output: { sampledArea: 2, perArea: 20, referenceCount: 20 },
} satisfies ToolExample<Input, Output>;
export const plateletResearchFieldAreaNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/platelet-research-field-area-normalizer",
      title: "Platelet Research Field Area Normalizer Tool",
      description:
        "Observed platelets per supplied imaged area, not an inferred blood concentration or platelet estimate multiplier.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "integer", minimum: 0 },
          fields: { type: "integer", minimum: 1 },
          fieldArea: { type: "number", exclusiveMinimum: 0 },
          referenceArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observed", "fields", "fieldArea", "referenceArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampledArea: { type: "number" },
          perArea: { type: "number" },
          referenceCount: { type: "number" },
        },
        required: ["sampledArea", "perArea", "referenceCount"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "fields",
            label: "Fields",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "fieldArea",
            label: "Field Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceArea",
            label: "Reference Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sampledArea",
            label: "Sampled Area",
            valueType: { type: "number" },
          },
          { id: "perArea", label: "Per Area", valueType: { type: "number" } },
          {
            id: "referenceCount",
            label: "Reference Count",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = plateletResearchFieldAreaNormalizerTool.execute;
export default plateletResearchFieldAreaNormalizerTool;
