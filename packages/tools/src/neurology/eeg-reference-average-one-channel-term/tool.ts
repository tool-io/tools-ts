import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelSignal: number;
  readonly referenceSignals: readonly number[];
  readonly includeChannel: boolean;
};
export type Output = {
  readonly referenceMean: number;
  readonly rereferenced: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelSignal: { type: "number" },
    referenceSignals: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    includeChannel: { type: "boolean" },
  },
  required: ["channelSignal", "referenceSignals", "includeChannel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMean: { type: "number" },
    rereferenced: { type: "number" },
  },
  required: ["referenceMean", "rereferenced"],
} as const;
/** One arithmetic average-reference channel transform using an explicit reference set and inclusion policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelSignal, referenceSignals, includeChannel } = request;
  const compute = (): Output => {
    H.domain(referenceSignals.length + (includeChannel ? 1 : 0) > 0);
    return {
      referenceMean:
        (referenceSignals.reduce((a, b) => a + b, 0) +
          (includeChannel ? channelSignal : 0)) /
        (referenceSignals.length + (includeChannel ? 1 : 0)),
      rereferenced:
        channelSignal -
        (referenceSignals.reduce((a, b) => a + b, 0) +
          (includeChannel ? channelSignal : 0)) /
          (referenceSignals.length + (includeChannel ? 1 : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    channelSignal: 10,
    referenceSignals: [2, 4, 6],
    includeChannel: false,
  },
  output: { referenceMean: 4, rereferenced: 6 },
} satisfies ToolExample<Input, Output>;
export const eegReferenceAverageOneChannelTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-reference-average-one-channel-term",
    title: "EEG Reference Average One Channel Term Tool",
    description:
      "One arithmetic average-reference channel transform using an explicit reference set and inclusion policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelSignal: { type: "number" },
        referenceSignals: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        includeChannel: { type: "boolean" },
      },
      required: ["channelSignal", "referenceSignals", "includeChannel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceMean: { type: "number" },
        rereferenced: { type: "number" },
      },
      required: ["referenceMean", "rereferenced"],
    },
    ports: {
      inputs: [
        {
          id: "channelSignal",
          label: "Channel Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSignals",
          label: "Reference Signals",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "includeChannel",
          label: "Include Channel",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "referenceMean",
          label: "Reference Mean",
          valueType: { type: "number" },
        },
        {
          id: "rereferenced",
          label: "Rereferenced",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegReferenceAverageOneChannelTermTool.execute;
export default eegReferenceAverageOneChannelTermTool;
