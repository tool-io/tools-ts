import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samplePeriod: number;
  readonly reportingPeriod: number;
};
export type Output = { readonly ratio: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplePeriod: { type: "number", exclusiveMinimum: 0 },
    reportingPeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["samplePeriod", "reportingPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, residual: { type: "number" } },
  required: ["ratio", "residual"],
} as const;
/** Compare supplied fixed-duration observation and reporting grains without resampling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samplePeriod, reportingPeriod } = request;
  const compute = (): Output => {
    H.positive(samplePeriod);
    H.positive(reportingPeriod);
    return {
      ratio: reportingPeriod / samplePeriod,
      residual:
        reportingPeriod -
        Math.floor(reportingPeriod / samplePeriod) * samplePeriod,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { samplePeriod: 3, reportingPeriod: 10 },
  output: { ratio: 3.3333333333333335, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const farmSensorRecordGrainGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-sensor-record-grain-gap",
    title: "Farm Sensor Record Grain Gap Tool",
    description:
      "Compare supplied fixed-duration observation and reporting grains without resampling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samplePeriod: { type: "number", exclusiveMinimum: 0 },
        reportingPeriod: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["samplePeriod", "reportingPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, residual: { type: "number" } },
      required: ["ratio", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "samplePeriod",
          label: "Sample Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportingPeriod",
          label: "Reporting Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmSensorRecordGrainGapTool.execute;
export default farmSensorRecordGrainGapTool;
