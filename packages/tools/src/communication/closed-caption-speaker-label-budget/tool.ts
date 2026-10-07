import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maximumCodePoints: number;
  readonly speakerLabel: string;
  readonly separator: string;
};
export type Output = {
  readonly labelCodePoints: number;
  readonly remainingCodePoints: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumCodePoints: { type: "integer", minimum: 0 },
    speakerLabel: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["maximumCodePoints", "speakerLabel", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelCodePoints: { type: "integer" },
    remainingCodePoints: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["labelCodePoints", "remainingCodePoints", "fits"],
} as const;
/** Count an explicit caption speaker-label prefix against a supplied Unicode code-point budget without truncating text or assuming display width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maximumCodePoints, speakerLabel, separator } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(maximumCodePoints) &&
        maximumCodePoints >= 0 &&
        maximumCodePoints <= Number.MAX_SAFE_INTEGER,
      "maximumCodePoints",
    ),
      maximumCodePoints);
    return (() => {
      const labelCodePoints = Array.from(speakerLabel + separator).length;
      return {
        labelCodePoints,
        remainingCodePoints: maximumCodePoints - labelCodePoints,
        fits: labelCodePoints <= maximumCodePoints,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { maximumCodePoints: 32, speakerLabel: "Speaker A", separator: ": " },
  output: { labelCodePoints: 11, remainingCodePoints: 21, fits: true },
} satisfies ToolExample<Input, Output>;
export const closedCaptionSpeakerLabelBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/closed-caption-speaker-label-budget",
    title: "Closed Caption Speaker Label Budget",
    description:
      "Count an explicit caption speaker-label prefix against a supplied Unicode code-point budget without truncating text or assuming display width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumCodePoints: { type: "integer", minimum: 0 },
        speakerLabel: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["maximumCodePoints", "speakerLabel", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelCodePoints: { type: "integer" },
        remainingCodePoints: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["labelCodePoints", "remainingCodePoints", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "maximumCodePoints",
          label: "Maximum Code Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "speakerLabel",
          label: "Speaker Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "labelCodePoints",
          label: "Label Code Points",
          valueType: { type: "integer" },
        },
        {
          id: "remainingCodePoints",
          label: "Remaining Code Points",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = closedCaptionSpeakerLabelBudgetTool.execute;
export default closedCaptionSpeakerLabelBudgetTool;
