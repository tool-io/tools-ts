import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldMeasurement: number;
  readonly baseAtMeasurement: number;
  readonly baseReference: number;
};
export type Output = {
  readonly baseDrift: number;
  readonly correctedField: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldMeasurement: { type: "number" },
    baseAtMeasurement: { type: "number" },
    baseReference: { type: "number" },
  },
  required: ["fieldMeasurement", "baseAtMeasurement", "baseReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseDrift: { type: "number" },
    correctedField: { type: "number" },
  },
  required: ["baseDrift", "correctedField"],
} as const;
/** Remove a synchronous base-station deviation; timing alignment and spatial representativeness must be established externally. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldMeasurement, baseAtMeasurement, baseReference } = request;
  const compute = (): Output => {
    return {
      baseDrift: baseAtMeasurement - baseReference,
      correctedField: fieldMeasurement - baseAtMeasurement + baseReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldMeasurement: 50010,
    baseAtMeasurement: 50005,
    baseReference: 50000,
  },
  output: { baseDrift: 5, correctedField: 50005 },
} satisfies ToolExample<Input, Output>;
export const magneticSurveyBaseStationDriftTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/magnetic-survey-base-station-drift-term",
    title: "Magnetic Survey Base Station Drift Term Tool",
    description:
      "Remove a synchronous base-station deviation; timing alignment and spatial representativeness must be established externally.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldMeasurement: { type: "number" },
        baseAtMeasurement: { type: "number" },
        baseReference: { type: "number" },
      },
      required: ["fieldMeasurement", "baseAtMeasurement", "baseReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseDrift: { type: "number" },
        correctedField: { type: "number" },
      },
      required: ["baseDrift", "correctedField"],
    },
    ports: {
      inputs: [
        {
          id: "fieldMeasurement",
          label: "Field Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseAtMeasurement",
          label: "Base At Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseReference",
          label: "Base Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "baseDrift", label: "Base Drift", valueType: { type: "number" } },
        {
          id: "correctedField",
          label: "Corrected Field",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = magneticSurveyBaseStationDriftTermTool.execute;
export default magneticSurveyBaseStationDriftTermTool;
