import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly calibrationId: string;
  readonly boundType: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calibrationId: { type: "string", maxLength: 8192, minLength: 1 },
    boundType: {
      type: "string",
      maxLength: 8192,
      enum: ["minimum", "maximum", "interval", "point", "unspecified"],
    },
  },
  required: ["calibrationId", "boundType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied fossil-calibration bound type without selecting ages, distributions or node assignments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { calibrationId, boundType } = request;
  const compute = (): Output => {
    H.domain(calibrationId.length > 0, "calibrationId");
    H.domain(
      ["minimum", "maximum", "interval", "point", "unspecified"].includes(
        boundType,
      ),
      "boundType",
    );
    return { label: calibrationId + " [" + boundType + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { calibrationId: "C17", boundType: "minimum" },
  output: { label: "C17 [minimum]" },
} satisfies ToolExample<Input, Output>;
export const fossilCalibrationBoundTypeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/fossil-calibration-bound-type-label",
    title: "Fossil Calibration Bound Type Label Tool",
    description:
      "Label an explicitly supplied fossil-calibration bound type without selecting ages, distributions or node assignments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calibrationId: { type: "string", maxLength: 8192, minLength: 1 },
        boundType: {
          type: "string",
          maxLength: 8192,
          enum: ["minimum", "maximum", "interval", "point", "unspecified"],
        },
      },
      required: ["calibrationId", "boundType"],
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
          id: "calibrationId",
          label: "Calibration Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundType",
          label: "Bound Type",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fossilCalibrationBoundTypeLabelTool.execute;
export default fossilCalibrationBoundTypeLabelTool;
