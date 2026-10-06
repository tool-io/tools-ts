import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceSeconds: number;
  readonly sensorSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceSeconds: { type: "number" },
    sensorSeconds: { type: "number" },
  },
  required: ["referenceSeconds", "sensorSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit reference from sensor timestamp values on the same time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceSeconds, sensorSeconds } = request;
  const compute = (): Output => {
    return { signedGap: sensorSeconds - referenceSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceSeconds: 12, sensorSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const farmSensorTimestampOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroinformatics", "agriculture"],
      keywords: ["agroinformatics", "agriculture"],
    },
    id: "agroinformatics/farm-sensor-timestamp-offset",
    title: "Farm Sensor Timestamp Offset",
    description:
      "Subtract explicit reference from sensor timestamp values on the same time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceSeconds: { type: "number" },
        sensorSeconds: { type: "number" },
      },
      required: ["referenceSeconds", "sensorSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceSeconds",
          label: "Reference Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sensorSeconds",
          label: "Sensor Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmSensorTimestampOffsetTool.execute;
export default farmSensorTimestampOffsetTool;
