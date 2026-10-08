import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly speakerLabel: string };
export type Output = { readonly normalized: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { speakerLabel: { type: "string", maxLength: 8192 } },
  required: ["speakerLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "string", maxLength: 8192 } },
  required: ["normalized"],
} as const;
/** Trim and collapse whitespace in a script speaker label before Unicode default uppercasing; no identity or role inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerLabel } = request;
  const compute = (): Output => {
    return {
      normalized: speakerLabel.trim().replace(/\s+/g, " ").toUpperCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakerLabel: "  alex   river  " },
  output: { normalized: "ALEX RIVER" },
} satisfies ToolExample<Input, Output>;
export const dialogueSpeakerLabelNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/dialogue-speaker-label-normalizer",
    title: "Dialogue Speaker Label Normalizer",
    description:
      "Trim and collapse whitespace in a script speaker label before Unicode default uppercasing; no identity or role inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { speakerLabel: { type: "string", maxLength: 8192 } },
      required: ["speakerLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalized: { type: "string", maxLength: 8192 } },
      required: ["normalized"],
    },
    ports: {
      inputs: [
        {
          id: "speakerLabel",
          label: "Speaker Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialogueSpeakerLabelNormalizerTool.execute;
export default dialogueSpeakerLabelNormalizerTool;
