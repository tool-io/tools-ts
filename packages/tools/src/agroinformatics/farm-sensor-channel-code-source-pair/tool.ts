import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channel: string;
  readonly source: string;
  readonly expectedChannel: string;
  readonly expectedSource: string;
};
export type Output = { readonly matches: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channel: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    expectedChannel: { type: "string", maxLength: 8192 },
    expectedSource: { type: "string", maxLength: 8192 },
  },
  required: ["channel", "source", "expectedChannel", "expectedSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "key"],
} as const;
/** Compare supplied farm sensor channel/source identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channel, source, expectedChannel, expectedSource } = request;
  const compute = (): Output => {
    return {
      matches: channel === expectedChannel && source === expectedSource,
      key: JSON.stringify([source, channel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    channel: "soil-1",
    source: "logger-A",
    expectedChannel: "soil-1",
    expectedSource: "logger-A",
  },
  output: { matches: true, key: '["logger-A","soil-1"]' },
} satisfies ToolExample<Input, Output>;
export const farmSensorChannelCodeSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-sensor-channel-code-source-pair",
    title: "Farm Sensor Channel Code Source Pair Tool",
    description: "Compare supplied farm sensor channel/source identifiers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channel: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        expectedChannel: { type: "string", maxLength: 8192 },
        expectedSource: { type: "string", maxLength: 8192 },
      },
      required: ["channel", "source", "expectedChannel", "expectedSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "key"],
    },
    ports: {
      inputs: [
        {
          id: "channel",
          label: "Channel",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedChannel",
          label: "Expected Channel",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSource",
          label: "Expected Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = farmSensorChannelCodeSourcePairTool.execute;
export default farmSensorChannelCodeSourcePairTool;
