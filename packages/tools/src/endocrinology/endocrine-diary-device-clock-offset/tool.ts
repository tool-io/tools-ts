import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceTimestamp: number;
  readonly suppliedDeviceMinusReference: number;
};
export type Output = { readonly referenceTimestamp: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceTimestamp: { type: "number" },
    suppliedDeviceMinusReference: { type: "number" },
  },
  required: ["deviceTimestamp", "suppliedDeviceMinusReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceTimestamp: { type: "number" } },
  required: ["referenceTimestamp"],
} as const;
/** Remove an explicit device-minus-reference clock offset from an endocrine diary timestamp without validating a clinical device. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceTimestamp, suppliedDeviceMinusReference } = request;
  const compute = (): Output => {
    return {
      referenceTimestamp: deviceTimestamp - suppliedDeviceMinusReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceTimestamp: 120, suppliedDeviceMinusReference: 5 },
  output: { referenceTimestamp: 115 },
} satisfies ToolExample<Input, Output>;
export const endocrineDiaryDeviceClockOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/endocrine-diary-device-clock-offset",
    title: "Endocrine Diary Device Clock Offset Tool",
    description:
      "Remove an explicit device-minus-reference clock offset from an endocrine diary timestamp without validating a clinical device.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceTimestamp: { type: "number" },
        suppliedDeviceMinusReference: { type: "number" },
      },
      required: ["deviceTimestamp", "suppliedDeviceMinusReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceTimestamp: { type: "number" } },
      required: ["referenceTimestamp"],
    },
    ports: {
      inputs: [
        {
          id: "deviceTimestamp",
          label: "Device Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDeviceMinusReference",
          label: "Supplied Device Minus Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceTimestamp",
          label: "Reference Timestamp",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = endocrineDiaryDeviceClockOffsetTool.execute;
export default endocrineDiaryDeviceClockOffsetTool;
