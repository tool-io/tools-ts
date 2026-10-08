import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureValue: number;
  readonly referenceOrigin: number;
  readonly unitsPerOutputUnit: number;
};
export type Output = { readonly transformedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureValue: { type: "number" },
    referenceOrigin: { type: "number" },
    unitsPerOutputUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["featureValue", "referenceOrigin", "unitsPerOutputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transformedValue: { type: "number" } },
  required: ["transformedValue"],
} as const;
/** Apply an explicit feature origin and positive input-units-per-output-unit scale without fitting a normalizer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureValue, referenceOrigin, unitsPerOutputUnit } = request;
  const compute = (): Output => {
    (H.domain(unitsPerOutputUnit > 0, "unitsPerOutputUnit"),
      unitsPerOutputUnit);
    return {
      transformedValue: (featureValue - referenceOrigin) / unitsPerOutputUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { featureValue: 150, referenceOrigin: 100, unitsPerOutputUnit: 10 },
  output: { transformedValue: 5 },
} satisfies ToolExample<Input, Output>;
export const featureUnitReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/feature-unit-reference-offset",
    title: "Feature Unit Reference Offset",
    description:
      "Apply an explicit feature origin and positive input-units-per-output-unit scale without fitting a normalizer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureValue: { type: "number" },
        referenceOrigin: { type: "number" },
        unitsPerOutputUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["featureValue", "referenceOrigin", "unitsPerOutputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transformedValue: { type: "number" } },
      required: ["transformedValue"],
    },
    ports: {
      inputs: [
        {
          id: "featureValue",
          label: "Feature Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOrigin",
          label: "Reference Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitsPerOutputUnit",
          label: "Units Per Output Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transformedValue",
          label: "Transformed Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureUnitReferenceOffsetTool.execute;
export default featureUnitReferenceOffsetTool;
