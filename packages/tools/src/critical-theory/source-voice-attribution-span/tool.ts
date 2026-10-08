import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly spanLocator: string;
  readonly suppliedVoice: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    spanLocator: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedVoice: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "spanLocator", "suppliedVoice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit text-span voice attribution and source without inferring speaker identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, spanLocator, suppliedVoice } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(spanLocator.length > 0, "spanLocator");
    H.domain(suppliedVoice.length > 0, "suppliedVoice");
    return { token: JSON.stringify([sourceId, spanLocator, suppliedVoice]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "S17",
    spanLocator: "lines 4-6",
    suppliedVoice: "narrator",
  },
  output: { token: '["S17","lines 4-6","narrator"]' },
} satisfies ToolExample<Input, Output>;
export const sourceVoiceAttributionSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/source-voice-attribution-span",
    title: "Source Voice Attribution Span",
    description:
      "Preserve an explicit text-span voice attribution and source without inferring speaker identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        spanLocator: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedVoice: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "spanLocator", "suppliedVoice"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "spanLocator",
          label: "Span Locator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedVoice",
          label: "Supplied Voice",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sourceVoiceAttributionSpanTool.execute;
export default sourceVoiceAttributionSpanTool;
