import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLevels: readonly number[];
  readonly referenceLevels: readonly number[];
  readonly channelIds: readonly string[];
  readonly selectedChannel: string;
};
export type Output = {
  readonly matchedPairs: number;
  readonly meanBias: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLevels: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceLevels: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    channelIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedChannel: { type: "string", maxLength: 8192 },
  },
  required: [
    "measuredLevels",
    "referenceLevels",
    "channelIds",
    "selectedChannel",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchedPairs: { type: "integer" },
    meanBias: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["matchedPairs", "meanBias", "defined"],
} as const;
/** Compare paired bench levels in one supplied channel; no diagnostic hearing threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLevels, referenceLevels, channelIds, selectedChannel } =
    request;
  const compute = (): Output => {
    H.sameLength(measuredLevels, referenceLevels);
    H.sameLength(measuredLevels, channelIds);
    return (() => {
      let matchedPairs = 0,
        sum = 0;
      channelIds.forEach((c, i) => {
        if (c === selectedChannel) {
          matchedPairs++;
          sum += measuredLevels[i] - referenceLevels[i];
        }
      });
      return {
        matchedPairs,
        meanBias: matchedPairs > 0 ? sum / matchedPairs : 0,
        defined: matchedPairs > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredLevels: [12, 15, 20],
    referenceLevels: [10, 14, 18],
    channelIds: ["L", "R", "L"],
    selectedChannel: "L",
  },
  output: { matchedPairs: 2, meanBias: 2, defined: true },
} satisfies ToolExample<Input, Output>;
export const toneChannelLevelBiasTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/tone-channel-level-bias",
    title: "Tone Channel Level Bias Tool",
    description:
      "Compare paired bench levels in one supplied channel; no diagnostic hearing threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLevels: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceLevels: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        channelIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedChannel: { type: "string", maxLength: 8192 },
      },
      required: [
        "measuredLevels",
        "referenceLevels",
        "channelIds",
        "selectedChannel",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchedPairs: { type: "integer" },
        meanBias: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["matchedPairs", "meanBias", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLevels",
          label: "Measured Levels",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceLevels",
          label: "Reference Levels",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "channelIds",
          label: "Channel Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedChannel",
          label: "Selected Channel",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchedPairs",
          label: "Matched Pairs",
          valueType: { type: "integer" },
        },
        { id: "meanBias", label: "Mean Bias", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = toneChannelLevelBiasTool.execute;
export default toneChannelLevelBiasTool;
