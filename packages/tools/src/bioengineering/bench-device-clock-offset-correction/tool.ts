import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceTimestampSeconds: number;
  readonly deviceMinusReferenceOffsetSeconds: number;
};
export type Output = { readonly referenceTimestampSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceTimestampSeconds: { type: "number" },
    deviceMinusReferenceOffsetSeconds: { type: "number" },
  },
  required: ["deviceTimestampSeconds", "deviceMinusReferenceOffsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceTimestampSeconds: { type: "number" } },
  required: ["referenceTimestampSeconds"],
} as const;
/** Correct a bench-device timestamp using an explicitly measured device-minus-reference additive clock offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceTimestampSeconds, deviceMinusReferenceOffsetSeconds } = request;
  const compute = (): Output => {
    return {
      referenceTimestampSeconds:
        deviceTimestampSeconds - deviceMinusReferenceOffsetSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceTimestampSeconds: 1000,
    deviceMinusReferenceOffsetSeconds: 2.5,
  },
  output: { referenceTimestampSeconds: 997.5 },
} satisfies ToolExample<Input, Output>;
export const benchDeviceClockOffsetCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/bench-device-clock-offset-correction",
    title: "Bench Device Clock Offset Correction",
    description:
      "Correct a bench-device timestamp using an explicitly measured device-minus-reference additive clock offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceTimestampSeconds: { type: "number" },
        deviceMinusReferenceOffsetSeconds: { type: "number" },
      },
      required: ["deviceTimestampSeconds", "deviceMinusReferenceOffsetSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceTimestampSeconds: { type: "number" } },
      required: ["referenceTimestampSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "deviceTimestampSeconds",
          label: "Device Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviceMinusReferenceOffsetSeconds",
          label: "Device Minus Reference Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceTimestampSeconds",
          label: "Reference Timestamp Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benchDeviceClockOffsetCorrectionTool.execute;
export default benchDeviceClockOffsetCorrectionTool;
