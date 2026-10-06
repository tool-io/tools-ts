import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedVolume: number;
  readonly suppliedCalibrationFactor: number;
};
export type Output = { readonly correctedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVolume: { type: "number", minimum: 0 },
    suppliedCalibrationFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedVolume", "suppliedCalibrationFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedVolume: { type: "number" } },
  required: ["correctedVolume"],
} as const;
/** Apply an explicitly supplied positive calibration factor to recorded milk volume without deriving device calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedVolume, suppliedCalibrationFactor } = request;
  const compute = (): Output => {
    H.domain(recordedVolume >= 0, "recordedVolume");
    (H.domain(
      Number.isFinite(suppliedCalibrationFactor) &&
        suppliedCalibrationFactor > 0,
      "suppliedCalibrationFactor",
    ),
      suppliedCalibrationFactor);
    return { correctedVolume: recordedVolume * suppliedCalibrationFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedVolume: 100, suppliedCalibrationFactor: 1.02 },
  output: { correctedVolume: 102 },
} satisfies ToolExample<Input, Output>;
export const milkRecordCorrectedVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/milk-record-corrected-volume-factor",
    title: "Milk Record Corrected Volume Factor",
    description:
      "Apply an explicitly supplied positive calibration factor to recorded milk volume without deriving device calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedVolume: { type: "number", minimum: 0 },
        suppliedCalibrationFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedVolume", "suppliedCalibrationFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedVolume: { type: "number" } },
      required: ["correctedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "recordedVolume",
          label: "Recorded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCalibrationFactor",
          label: "Supplied Calibration Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milkRecordCorrectedVolumeFactorTool.execute;
export default milkRecordCorrectedVolumeFactorTool;
