import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly channelId: string;
  readonly channelSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    channelId: { type: "string", maxLength: 8192, minLength: 1 },
    channelSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "channelId", "channelSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit monitor channel provenance without interpreting measurements or alarms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, channelId, channelSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(channelId.length > 0, "channelId");
    H.domain(channelSource.length > 0, "channelSource");
    return { token: JSON.stringify([recordId, channelId, channelSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", channelId: "CH3", channelSource: "Monitor A" },
  output: { token: '["R17","CH3","Monitor A"]' },
} satisfies ToolExample<Input, Output>;
export const anesthesiaMonitorChannelTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anesthesiology", "health and medicine"],
      keywords: ["anesthesiology", "health and medicine"],
    },
    id: "anesthesiology/anesthesia-monitor-channel-tag",
    title: "Anesthesia Monitor Channel Tag",
    description:
      "Record explicit monitor channel provenance without interpreting measurements or alarms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        channelId: { type: "string", maxLength: 8192, minLength: 1 },
        channelSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "channelId", "channelSource"],
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
          id: "recordId",
          label: "Record Id",
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
          id: "channelSource",
          label: "Channel Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = anesthesiaMonitorChannelTagTool.execute;
export default anesthesiaMonitorChannelTagTool;
