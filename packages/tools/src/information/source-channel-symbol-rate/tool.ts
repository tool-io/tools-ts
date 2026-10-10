import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceSymbolsPerSecond: number;
  readonly channelSymbolsPerSourceSymbol: number;
};
export type Output = { readonly channelSymbolsPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceSymbolsPerSecond: { type: "number", minimum: 0 },
    channelSymbolsPerSourceSymbol: { type: "number", minimum: 0 },
  },
  required: ["sourceSymbolsPerSecond", "channelSymbolsPerSourceSymbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { channelSymbolsPerSecond: { type: "number" } },
  required: ["channelSymbolsPerSecond"],
} as const;
/** Multiply explicit source symbol rate by a supplied channel-symbol expansion factor without inferring coding efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceSymbolsPerSecond, channelSymbolsPerSourceSymbol } = request;
  const compute = (): Output => {
    H.domain(
      sourceSymbolsPerSecond >= 0 && channelSymbolsPerSourceSymbol >= 0,
      "sourceSymbolsPerSecond",
    );
    return {
      channelSymbolsPerSecond:
        sourceSymbolsPerSecond * channelSymbolsPerSourceSymbol,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceSymbolsPerSecond: 100, channelSymbolsPerSourceSymbol: 2.5 },
  output: { channelSymbolsPerSecond: 250 },
} satisfies ToolExample<Input, Output>;
export const sourceChannelSymbolRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["information", "information theory", "computer science"],
      keywords: ["information theory", "computer science"],
    },
    id: "information/source-channel-symbol-rate",
    title: "Source Channel Symbol Rate",
    description:
      "Multiply explicit source symbol rate by a supplied channel-symbol expansion factor without inferring coding efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceSymbolsPerSecond: { type: "number", minimum: 0 },
        channelSymbolsPerSourceSymbol: { type: "number", minimum: 0 },
      },
      required: ["sourceSymbolsPerSecond", "channelSymbolsPerSourceSymbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { channelSymbolsPerSecond: { type: "number" } },
      required: ["channelSymbolsPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "sourceSymbolsPerSecond",
          label: "Source Symbols Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "channelSymbolsPerSourceSymbol",
          label: "Channel Symbols Per Source Symbol",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "channelSymbolsPerSecond",
          label: "Channel Symbols Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceChannelSymbolRateTool.execute;
export default sourceChannelSymbolRateTool;
