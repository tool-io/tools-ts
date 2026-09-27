import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly axis: string;
  readonly unit: string;
  readonly expectedAxis: string;
  readonly expectedUnit: string;
};
export type Output = {
  readonly compatible: boolean;
  readonly recordKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    axis: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192 },
    expectedAxis: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
  },
  required: ["value", "axis", "unit", "expectedAxis", "expectedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compatible: { type: "boolean" },
    recordKey: { type: "string", maxLength: 8192 },
  },
  required: ["compatible", "recordKey"],
} as const;
/** Retain an explicitly supplied instrument measurement axis and unit without organological classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, axis, unit, expectedAxis, expectedUnit } = request;
  const compute = (): Output => {
    return {
      compatible: axis === expectedAxis && unit === expectedUnit,
      recordKey: JSON.stringify([axis, unit, value]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    value: 10,
    axis: "length",
    unit: "cm",
    expectedAxis: "length",
    expectedUnit: "cm",
  },
  output: { compatible: true, recordKey: '["length","cm",10]' },
} satisfies ToolExample<Input, Output>;
export const instrumentMeasureAxisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/instrument-measure-axis-label",
    title: "Instrument Measure Axis Label Tool",
    description:
      "Retain an explicitly supplied instrument measurement axis and unit without organological classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        axis: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192 },
        expectedAxis: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
      },
      required: ["value", "axis", "unit", "expectedAxis", "expectedUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        compatible: { type: "boolean" },
        recordKey: { type: "string", maxLength: 8192 },
      },
      required: ["compatible", "recordKey"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axis",
          label: "Axis",
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
          id: "expectedAxis",
          label: "Expected Axis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUnit",
          label: "Expected Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "compatible",
          label: "Compatible",
          valueType: { type: "boolean" },
        },
        { id: "recordKey", label: "Record Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = instrumentMeasureAxisLabelTool.execute;
export default instrumentMeasureAxisLabelTool;
