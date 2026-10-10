import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pregnancyRecordId: string;
  readonly channelId: string;
  readonly recordedFetusCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pregnancyRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    channelId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedFetusCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["pregnancyRecordId", "channelId", "recordedFetusCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly assigned fetus/channel association without identifying fetuses from monitor signals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pregnancyRecordId, channelId, recordedFetusCode } = request;
  const compute = (): Output => {
    H.domain(pregnancyRecordId.length > 0, "pregnancyRecordId");
    H.domain(channelId.length > 0, "channelId");
    H.domain(recordedFetusCode.length > 0, "recordedFetusCode");
    return {
      token: JSON.stringify([pregnancyRecordId, channelId, recordedFetusCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pregnancyRecordId: "P17",
    channelId: "CH1",
    recordedFetusCode: "FETUS-A",
  },
  output: { token: '["P17","CH1","FETUS-A"]' },
} satisfies ToolExample<Input, Output>;
export const fetalMonitorTwinChannelLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/fetal-monitor-twin-channel-label",
    title: "Fetal Monitor Twin Channel Label",
    description:
      "Record an explicitly assigned fetus/channel association without identifying fetuses from monitor signals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pregnancyRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        channelId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedFetusCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["pregnancyRecordId", "channelId", "recordedFetusCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "pregnancyRecordId",
          label: "Pregnancy Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "channelId",
          label: "Channel Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedFetusCode",
          label: "Recorded Fetus Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fetalMonitorTwinChannelLabelTool.execute;
export default fetalMonitorTwinChannelLabelTool;
