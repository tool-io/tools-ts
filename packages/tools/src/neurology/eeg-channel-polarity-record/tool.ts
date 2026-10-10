import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelId: string;
  readonly reversePolarity: boolean;
  readonly suppliedAmplitude: number;
};
export type Output = {
  readonly recordedAmplitude: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelId: { type: "string", maxLength: 8192, minLength: 1 },
    reversePolarity: { type: "boolean" },
    suppliedAmplitude: { type: "number" },
  },
  required: ["channelId", "reversePolarity", "suppliedAmplitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAmplitude: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["recordedAmplitude", "label"],
} as const;
/** Apply an explicit EEG channel polarity flag without inferring an electrode montage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelId, reversePolarity, suppliedAmplitude } = request;
  const compute = (): Output => {
    H.domain(channelId.length > 0, "channelId");
    return {
      recordedAmplitude: reversePolarity
        ? -suppliedAmplitude
        : suppliedAmplitude,
      label:
        channelId + " [" + (reversePolarity ? "reversed" : "as supplied") + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelId: "CH17", reversePolarity: true, suppliedAmplitude: 5 },
  output: { recordedAmplitude: -5, label: "CH17 [reversed]" },
} satisfies ToolExample<Input, Output>;
export const eegChannelPolarityRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/eeg-channel-polarity-record",
    title: "EEG Channel Polarity Record",
    description:
      "Apply an explicit EEG channel polarity flag without inferring an electrode montage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelId: { type: "string", maxLength: 8192, minLength: 1 },
        reversePolarity: { type: "boolean" },
        suppliedAmplitude: { type: "number" },
      },
      required: ["channelId", "reversePolarity", "suppliedAmplitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAmplitude: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["recordedAmplitude", "label"],
    },
    ports: {
      inputs: [
        {
          id: "channelId",
          label: "Channel Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reversePolarity",
          label: "Reverse Polarity",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedAmplitude",
          label: "Supplied Amplitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedAmplitude",
          label: "Recorded Amplitude",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = eegChannelPolarityRecordTool.execute;
export default eegChannelPolarityRecordTool;
