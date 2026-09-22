import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly column: number;
  readonly measuredPressure: number;
  readonly referencePressure: number;
};
export type Output = {
  readonly normalizedColumn: number;
  readonly factor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "number" },
    measuredPressure: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["column", "measuredPressure", "referencePressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedColumn: { type: "number" },
    factor: { type: "number" },
  },
  required: ["normalizedColumn", "factor"],
} as const;
/** Conditional pressure-proportional column normalization at fixed supplied temperature/path assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { column, measuredPressure, referencePressure } = request;
  const compute = (): Output => {
    H.positive(measuredPressure);
    H.positive(referencePressure);
    return {
      normalizedColumn: (column * referencePressure) / measuredPressure,
      factor: referencePressure / measuredPressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { column: 100, measuredPressure: 80, referencePressure: 100 },
  output: { normalizedColumn: 125, factor: 1.25 },
} satisfies ToolExample<Input, Output>;
export const gasColumnReferencePressureGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/gas-column-reference-pressure-gap",
    title: "Gas Column Reference Pressure Gap Tool",
    description:
      "Conditional pressure-proportional column normalization at fixed supplied temperature/path assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        column: { type: "number" },
        measuredPressure: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["column", "measuredPressure", "referencePressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedColumn: { type: "number" },
        factor: { type: "number" },
      },
      required: ["normalizedColumn", "factor"],
    },
    ports: {
      inputs: [
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPressure",
          label: "Measured Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedColumn",
          label: "Normalized Column",
          valueType: { type: "number" },
        },
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gasColumnReferencePressureGapTool.execute;
export default gasColumnReferencePressureGapTool;
