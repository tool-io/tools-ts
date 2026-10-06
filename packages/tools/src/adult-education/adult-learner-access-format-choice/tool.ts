import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredFormat: string;
  readonly availableFormats: readonly string[];
  readonly fallbackFormat: string;
};
export type Output = {
  readonly chosenFormat: string;
  readonly preferredAvailable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredFormat: { type: "string", maxLength: 8192, minLength: 1 },
    availableFormats: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    fallbackFormat: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["preferredFormat", "availableFormats", "fallbackFormat"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chosenFormat: { type: "string", maxLength: 8192 },
    preferredAvailable: { type: "boolean" },
  },
  required: ["chosenFormat", "preferredAvailable"],
} as const;
/** Select an explicitly preferred access format when listed, otherwise an explicitly chosen available fallback; no preference is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferredFormat, availableFormats, fallbackFormat } = request;
  const compute = (): Output => {
    H.domain(
      preferredFormat.length > 0 && fallbackFormat.length > 0,
      "preferredFormat",
    );
    const preferredAvailable = availableFormats.includes(preferredFormat);
    H.domain(
      preferredAvailable || availableFormats.includes(fallbackFormat),
      "fallbackFormat",
    );
    return {
      chosenFormat: preferredAvailable ? preferredFormat : fallbackFormat,
      preferredAvailable,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preferredFormat: "audio",
    availableFormats: ["text", "audio"],
    fallbackFormat: "text",
  },
  output: { chosenFormat: "audio", preferredAvailable: true },
} satisfies ToolExample<Input, Output>;
export const adultlearnerAccessFormatChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/adult-learner-access-format-choice",
    title: "Adult Learner Access Format Choice",
    description:
      "Select an explicitly preferred access format when listed, otherwise an explicitly chosen available fallback; no preference is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredFormat: { type: "string", maxLength: 8192, minLength: 1 },
        availableFormats: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        fallbackFormat: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["preferredFormat", "availableFormats", "fallbackFormat"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chosenFormat: { type: "string", maxLength: 8192 },
        preferredAvailable: { type: "boolean" },
      },
      required: ["chosenFormat", "preferredAvailable"],
    },
    ports: {
      inputs: [
        {
          id: "preferredFormat",
          label: "Preferred Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "availableFormats",
          label: "Available Formats",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "fallbackFormat",
          label: "Fallback Format",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "chosenFormat",
          label: "Chosen Format",
          valueType: { type: "string" },
        },
        {
          id: "preferredAvailable",
          label: "Preferred Available",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = adultlearnerAccessFormatChoiceTool.execute;
export default adultlearnerAccessFormatChoiceTool;
