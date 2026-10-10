import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly value: number;
  readonly unitText: string;
  readonly measurementAxis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    value: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    measurementAxis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "value", "unitText", "measurementAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit tissue dimension and unit without converting axes or determining specimen size categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, value, unitText, measurementAxis } = request;
  const compute = (): Output => {
    H.domain(
      specimenId.length > 0 &&
        unitText.length > 0 &&
        measurementAxis.length > 0,
      "specimenId",
    );
    H.domain(value >= 0, "value");
    return {
      label: specimenId + "; " + measurementAxis + "=" + value + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    value: 12,
    unitText: "mm",
    measurementAxis: "length",
  },
  output: { label: "S17; length=12 mm" },
} satisfies ToolExample<Input, Output>;
export const tissueMeasurementUnitBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/tissue-measurement-unit-basis",
    title: "Tissue Measurement Unit Basis",
    description:
      "Label an explicit tissue dimension and unit without converting axes or determining specimen size categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        value: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        measurementAxis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "value", "unitText", "measurementAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementAxis",
          label: "Measurement Axis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tissueMeasurementUnitBasisTool.execute;
export default tissueMeasurementUnitBasisTool;
