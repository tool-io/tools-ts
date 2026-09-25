import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakerPrefix: string;
  readonly caption: string;
  readonly limit: number;
  readonly separator: string;
};
export type Output = {
  readonly used: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakerPrefix: { type: "string", maxLength: 8192 },
    caption: { type: "string", maxLength: 8192 },
    limit: { type: "integer", minimum: 0 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["speakerPrefix", "caption", "limit", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    used: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["used", "remaining", "fits"],
} as const;
/** Count Unicode code points in the explicitly composed speaker-prefix caption, not rendered grapheme width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerPrefix, caption, limit, separator } = request;
  const compute = (): Output => {
    H.integer(limit, 0);
    const used = [...(speakerPrefix + separator + caption)].length;
    return { used, remaining: limit - used, fits: used <= limit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakerPrefix: "A", caption: "Hello", limit: 10, separator: ": " },
  output: { used: 8, remaining: 2, fits: true },
} satisfies ToolExample<Input, Output>;
export const captionCueSpeakerPrefixBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/caption-cue-speaker-prefix-budget",
    title: "Caption Cue Speaker Prefix Budget Tool",
    description:
      "Count Unicode code points in the explicitly composed speaker-prefix caption, not rendered grapheme width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerPrefix: { type: "string", maxLength: 8192 },
        caption: { type: "string", maxLength: 8192 },
        limit: { type: "integer", minimum: 0 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["speakerPrefix", "caption", "limit", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        used: { type: "integer" },
        remaining: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["used", "remaining", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "speakerPrefix",
          label: "Speaker Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caption",
          label: "Caption",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = captionCueSpeakerPrefixBudgetTool.execute;
export default captionCueSpeakerPrefixBudgetTool;
