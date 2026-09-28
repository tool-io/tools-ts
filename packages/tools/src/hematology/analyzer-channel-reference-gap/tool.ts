import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelIds: readonly string[];
  readonly readings: readonly number[];
  readonly suppliedReferences: readonly number[];
  readonly selectedChannel: string;
};
export type Output = {
  readonly pairs: number;
  readonly meanGap: number;
  readonly largestAbsoluteGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    readings: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedReferences: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    selectedChannel: { type: "string", maxLength: 8192 },
  },
  required: ["channelIds", "readings", "suppliedReferences", "selectedChannel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pairs: { type: "integer" },
    meanGap: { type: "number" },
    largestAbsoluteGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["pairs", "meanGap", "largestAbsoluteGap", "defined"],
} as const;
/** Compare supplied nonclinical analyzer/reference pairs for an explicit channel; no diagnostic ranges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelIds, readings, suppliedReferences, selectedChannel } = request;
  const compute = (): Output => {
    H.sameLength(channelIds, readings);
    H.sameLength(channelIds, suppliedReferences);
    return (() => {
      const gaps = readings
          .filter((x, i) => channelIds[i] === selectedChannel)
          .map((x, k) => x),
        indices = channelIds.flatMap((x, i) =>
          x === selectedChannel ? [i] : [],
        ),
        d = indices.map((i) => readings[i] - suppliedReferences[i]);
      return {
        pairs: gaps.length,
        meanGap: d.length > 0 ? d.reduce((a, b) => a + b, 0) / d.length : 0,
        largestAbsoluteGap: Math.max(0, ...d.map(Math.abs)),
        defined: d.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    channelIds: ["A", "B", "A"],
    readings: [2, 5, 6],
    suppliedReferences: [1, 5, 4],
    selectedChannel: "A",
  },
  output: { pairs: 2, meanGap: 1.5, largestAbsoluteGap: 2, defined: true },
} satisfies ToolExample<Input, Output>;
export const analyzerChannelReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/analyzer-channel-reference-gap",
    title: "Analyzer Channel Reference Gap Tool",
    description:
      "Compare supplied nonclinical analyzer/reference pairs for an explicit channel; no diagnostic ranges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        readings: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedReferences: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        selectedChannel: { type: "string", maxLength: 8192 },
      },
      required: [
        "channelIds",
        "readings",
        "suppliedReferences",
        "selectedChannel",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pairs: { type: "integer" },
        meanGap: { type: "number" },
        largestAbsoluteGap: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["pairs", "meanGap", "largestAbsoluteGap", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "channelIds",
          label: "Channel Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "readings",
          label: "Readings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedReferences",
          label: "Supplied References",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedChannel",
          label: "Selected Channel",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "pairs", label: "Pairs", valueType: { type: "integer" } },
        { id: "meanGap", label: "Mean Gap", valueType: { type: "number" } },
        {
          id: "largestAbsoluteGap",
          label: "Largest Absolute Gap",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = analyzerChannelReferenceGapTool.execute;
export default analyzerChannelReferenceGapTool;
