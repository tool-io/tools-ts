import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLength: number;
  readonly recordedUnitsPerActualUnit: number;
};
export type Output = { readonly actualLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLength: { type: "number", minimum: 0 },
    recordedUnitsPerActualUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedLength", "recordedUnitsPerActualUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { actualLength: { type: "number" } },
  required: ["actualLength"],
} as const;
/** Calculate artifact measurement scale factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedLength, recordedUnitsPerActualUnit } = request;
  const compute = (): Output => {
    H.domain(recordedLength >= 0);
    H.positive(recordedUnitsPerActualUnit);
    return { actualLength: recordedLength / recordedUnitsPerActualUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedLength: 30, recordedUnitsPerActualUnit: 10 },
  output: { actualLength: 3 },
} satisfies ToolExample<Input, Output>;
export const artifactMeasurementScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/artifact-measurement-scale-factor",
    title: "Artifact Measurement Scale Factor Tool",
    description:
      "Calculate artifact measurement scale factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLength: { type: "number", minimum: 0 },
        recordedUnitsPerActualUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedLength", "recordedUnitsPerActualUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { actualLength: { type: "number" } },
      required: ["actualLength"],
    },
    ports: {
      inputs: [
        {
          id: "recordedLength",
          label: "Recorded Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedUnitsPerActualUnit",
          label: "Recorded Units Per Actual Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualLength",
          label: "Actual Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artifactMeasurementScaleFactorTool.execute;
export default artifactMeasurementScaleFactorTool;
