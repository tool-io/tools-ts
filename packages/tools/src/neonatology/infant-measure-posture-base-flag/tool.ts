import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLength: number;
  readonly measuredRecumbent: boolean;
  readonly suppliedPostureCorrection: number;
  readonly targetRecumbent: boolean;
};
export type Output = {
  readonly adjustedLength: number;
  readonly corrected: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLength: { type: "number", minimum: 0 },
    measuredRecumbent: { type: "boolean" },
    suppliedPostureCorrection: { type: "number", minimum: 0 },
    targetRecumbent: { type: "boolean" },
  },
  required: [
    "recordedLength",
    "measuredRecumbent",
    "suppliedPostureCorrection",
    "targetRecumbent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedLength: { type: "number" },
    corrected: { type: "boolean" },
  },
  required: ["adjustedLength", "corrected"],
} as const;
/** Apply a caller-supplied posture correction with explicit direction; no pediatric conversion constant or growth assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedLength,
    measuredRecumbent,
    suppliedPostureCorrection,
    targetRecumbent,
  } = request;
  const compute = (): Output => {
    H.domain(
      recordedLength >= 0 &&
        suppliedPostureCorrection >= 0 &&
        recordedLength >= suppliedPostureCorrection,
    );
    return {
      adjustedLength:
        recordedLength +
        (measuredRecumbent === targetRecumbent
          ? 0
          : targetRecumbent
            ? suppliedPostureCorrection
            : -suppliedPostureCorrection),
      corrected: measuredRecumbent !== targetRecumbent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedLength: 50,
    measuredRecumbent: false,
    suppliedPostureCorrection: 1,
    targetRecumbent: true,
  },
  output: { adjustedLength: 51, corrected: true },
} satisfies ToolExample<Input, Output>;
export const infantMeasurePostureBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/infant-measure-posture-base-flag",
    title: "Infant Measure Posture Base Flag Tool",
    description:
      "Apply a caller-supplied posture correction with explicit direction; no pediatric conversion constant or growth assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLength: { type: "number", minimum: 0 },
        measuredRecumbent: { type: "boolean" },
        suppliedPostureCorrection: { type: "number", minimum: 0 },
        targetRecumbent: { type: "boolean" },
      },
      required: [
        "recordedLength",
        "measuredRecumbent",
        "suppliedPostureCorrection",
        "targetRecumbent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedLength: { type: "number" },
        corrected: { type: "boolean" },
      },
      required: ["adjustedLength", "corrected"],
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
          id: "measuredRecumbent",
          label: "Measured Recumbent",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedPostureCorrection",
          label: "Supplied Posture Correction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetRecumbent",
          label: "Target Recumbent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "adjustedLength",
          label: "Adjusted Length",
          valueType: { type: "number" },
        },
        { id: "corrected", label: "Corrected", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = infantMeasurePostureBaseFlagTool.execute;
export default infantMeasurePostureBaseFlagTool;
