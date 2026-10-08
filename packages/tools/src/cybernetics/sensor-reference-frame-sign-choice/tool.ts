import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sensorValue: number;
  readonly reverseAxis: boolean;
};
export type Output = { readonly referenceValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensorValue: { type: "number" },
    reverseAxis: { type: "boolean" },
  },
  required: ["sensorValue", "reverseAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceValue: { type: "number" } },
  required: ["referenceValue"],
} as const;
/** Apply an explicit sensor-axis sign reversal without inferring orientation or calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sensorValue, reverseAxis } = request;
  const compute = (): Output => {
    return { referenceValue: reverseAxis ? -sensorValue : sensorValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sensorValue: 3, reverseAxis: true },
  output: { referenceValue: -3 },
} satisfies ToolExample<Input, Output>;
export const sensorReferenceFrameSignChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/sensor-reference-frame-sign-choice",
    title: "Sensor Reference Frame Sign Choice Tool",
    description:
      "Apply an explicit sensor-axis sign reversal without inferring orientation or calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sensorValue: { type: "number" },
        reverseAxis: { type: "boolean" },
      },
      required: ["sensorValue", "reverseAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceValue: { type: "number" } },
      required: ["referenceValue"],
    },
    ports: {
      inputs: [
        {
          id: "sensorValue",
          label: "Sensor Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "referenceValue",
          label: "Reference Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sensorReferenceFrameSignChoiceTool.execute;
export default sensorReferenceFrameSignChoiceTool;
