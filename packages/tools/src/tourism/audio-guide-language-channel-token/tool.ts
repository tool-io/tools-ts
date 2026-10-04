import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedLanguage: string;
  readonly channelLanguages: readonly string[];
  readonly channelIds: readonly string[];
};
export type Output = { readonly found: boolean; readonly channelId: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedLanguage: { type: "string", maxLength: 8192 },
    channelLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    channelIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestedLanguage", "channelLanguages", "channelIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    channelId: { type: "string", maxLength: 8192 },
  },
  required: ["found", "channelId"],
} as const;
/** Resolve one exact supplied language token against a caller-provided channel map. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedLanguage, channelLanguages, channelIds } = request;
  const compute = (): Output => {
    H.sameLength(channelLanguages, channelIds);
    H.domain(new Set(channelLanguages).size === channelLanguages.length);
    const i = channelLanguages.indexOf(requestedLanguage);
    return { found: i >= 0, channelId: i >= 0 ? channelIds[i] : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedLanguage: "fr",
    channelLanguages: ["en", "fr"],
    channelIds: ["1", "2"],
  },
  output: { found: true, channelId: "2" },
} satisfies ToolExample<Input, Output>;
export const audioGuideLanguageChannelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/audio-guide-language-channel-token",
    title: "Audio Guide Language Channel Token Tool",
    description:
      "Resolve one exact supplied language token against a caller-provided channel map.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedLanguage: { type: "string", maxLength: 8192 },
        channelLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        channelIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestedLanguage", "channelLanguages", "channelIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        channelId: { type: "string", maxLength: 8192 },
      },
      required: ["found", "channelId"],
    },
    ports: {
      inputs: [
        {
          id: "requestedLanguage",
          label: "Requested Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "channelLanguages",
          label: "Channel Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "channelIds",
          label: "Channel Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "channelId", label: "Channel Id", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = audioGuideLanguageChannelTokenTool.execute;
export default audioGuideLanguageChannelTokenTool;
