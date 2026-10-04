import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFormat: string;
  readonly supportedFormats: readonly string[];
};
export type Output = { readonly supported: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFormat: { type: "string", maxLength: 8192 },
    supportedFormats: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredFormat", "supportedFormats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { supported: { type: "boolean" } },
  required: ["supported"],
} as const;
/** Check an exact requested communication-format code against an explicit channel capability list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFormat, supportedFormats } = request;
  const compute = (): Output => {
    H.domain(requiredFormat.length > 0, "requiredFormat");
    return { supported: supportedFormats.includes(requiredFormat) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredFormat: "text", supportedFormats: ["text", "audio"] },
  output: { supported: true },
} satisfies ToolExample<Input, Output>;
export const communicationChannelFormatMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/communication-channel-format-match",
    title: "Communication Channel Format Match Tool",
    description:
      "Check an exact requested communication-format code against an explicit channel capability list.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFormat: { type: "string", maxLength: 8192 },
        supportedFormats: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredFormat", "supportedFormats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { supported: { type: "boolean" } },
      required: ["supported"],
    },
    ports: {
      inputs: [
        {
          id: "requiredFormat",
          label: "Required Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "supportedFormats",
          label: "Supported Formats",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "supported", label: "Supported", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = communicationChannelFormatMatchTool.execute;
export default communicationChannelFormatMatchTool;
