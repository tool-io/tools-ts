import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalSetting: number;
  readonly adjustment: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = {
  readonly proposedSetting: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly insideRecordedRange: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalSetting: { type: "number" },
    adjustment: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["originalSetting", "adjustment", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proposedSetting: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    insideRecordedRange: { type: "boolean" },
  },
  required: [
    "proposedSetting",
    "lowerMargin",
    "upperMargin",
    "insideRecordedRange",
  ],
} as const;
/** Arithmetic audit against an explicitly supplied device-setting range, not a fitting or safe-use recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalSetting, adjustment, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(maximum >= minimum);
    return {
      proposedSetting: originalSetting + adjustment,
      lowerMargin: originalSetting + adjustment - minimum,
      upperMargin: maximum - originalSetting - adjustment,
      insideRecordedRange:
        originalSetting + adjustment >= minimum &&
        originalSetting + adjustment <= maximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalSetting: 10, adjustment: 2, minimum: 5, maximum: 15 },
  output: {
    proposedSetting: 12,
    lowerMargin: 7,
    upperMargin: 3,
    insideRecordedRange: true,
  },
} satisfies ToolExample<Input, Output>;
export const assistiveDeviceAdjustmentRecordOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/assistive-device-adjustment-record-offset",
      title: "Assistive Device Adjustment Record Offset Tool",
      description:
        "Arithmetic audit against an explicitly supplied device-setting range, not a fitting or safe-use recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalSetting: { type: "number" },
          adjustment: { type: "number" },
          minimum: { type: "number" },
          maximum: { type: "number" },
        },
        required: ["originalSetting", "adjustment", "minimum", "maximum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          proposedSetting: { type: "number" },
          lowerMargin: { type: "number" },
          upperMargin: { type: "number" },
          insideRecordedRange: { type: "boolean" },
        },
        required: [
          "proposedSetting",
          "lowerMargin",
          "upperMargin",
          "insideRecordedRange",
        ],
      },
      ports: {
        inputs: [
          {
            id: "originalSetting",
            label: "Original Setting",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "adjustment",
            label: "Adjustment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "proposedSetting",
            label: "Proposed Setting",
            valueType: { type: "number" },
          },
          {
            id: "lowerMargin",
            label: "Lower Margin",
            valueType: { type: "number" },
          },
          {
            id: "upperMargin",
            label: "Upper Margin",
            valueType: { type: "number" },
          },
          {
            id: "insideRecordedRange",
            label: "Inside Recorded Range",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = assistiveDeviceAdjustmentRecordOffsetTool.execute;
export default assistiveDeviceAdjustmentRecordOffsetTool;
