import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alarmStartSeconds: number;
  readonly alarmEndSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alarmStartSeconds: { type: "number" },
    alarmEndSeconds: { type: "number" },
  },
  required: ["alarmStartSeconds", "alarmEndSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit storage-alarm timestamps in seconds without selecting limits or assessing stored material. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alarmStartSeconds, alarmEndSeconds } = request;
  const compute = (): Output => {
    return { signedGap: alarmEndSeconds - alarmStartSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alarmStartSeconds: 12, alarmEndSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const biosafetyStorageAlarmDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosafety", "research and quality management"],
      keywords: ["biosafety", "research and quality management"],
    },
    id: "biosafety/biosafety-storage-alarm-duration",
    title: "Biosafety Storage Alarm Duration",
    description:
      "Subtract explicit storage-alarm timestamps in seconds without selecting limits or assessing stored material.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alarmStartSeconds: { type: "number" },
        alarmEndSeconds: { type: "number" },
      },
      required: ["alarmStartSeconds", "alarmEndSeconds"],
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
          id: "alarmStartSeconds",
          label: "Alarm Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alarmEndSeconds",
          label: "Alarm End Seconds",
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
export const run = biosafetyStorageAlarmDurationTool.execute;
export default biosafetyStorageAlarmDurationTool;
