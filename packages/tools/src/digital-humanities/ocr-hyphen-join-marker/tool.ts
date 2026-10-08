import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineEndText: string;
  readonly nextLineStartText: string;
  readonly discretionaryHyphen: boolean;
};
export type Output = {
  readonly joinedText: string;
  readonly hyphenRemoved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineEndText: { type: "string", maxLength: 8192 },
    nextLineStartText: { type: "string", maxLength: 8192 },
    discretionaryHyphen: { type: "boolean" },
  },
  required: ["lineEndText", "nextLineStartText", "discretionaryHyphen"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    joinedText: { type: "string", maxLength: 8192 },
    hyphenRemoved: { type: "boolean" },
  },
  required: ["joinedText", "hyphenRemoved"],
} as const;
/** Join explicit OCR line fragments, removing a final ASCII hyphen only when it is explicitly marked discretionary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineEndText, nextLineStartText, discretionaryHyphen } = request;
  const compute = (): Output => {
    const hyphenRemoved = discretionaryHyphen && lineEndText.endsWith("-");
    H.domain(!discretionaryHyphen || hyphenRemoved, "lineEndText");
    return {
      joinedText:
        (hyphenRemoved ? lineEndText.slice(0, -1) : lineEndText) +
        nextLineStartText,
      hyphenRemoved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lineEndText: "inter-",
    nextLineStartText: "national",
    discretionaryHyphen: true,
  },
  output: { joinedText: "international", hyphenRemoved: true },
} satisfies ToolExample<Input, Output>;
export const ocrHyphenJoinMarkerTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["digital-humanities", "digital humanities", "humanities"],
        keywords: ["digital humanities", "humanities"],
      },
      id: "digital-humanities/ocr-hyphen-join-marker",
      title: "OCR Hyphen Join Marker",
      description:
        "Join explicit OCR line fragments, removing a final ASCII hyphen only when it is explicitly marked discretionary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lineEndText: { type: "string", maxLength: 8192 },
          nextLineStartText: { type: "string", maxLength: 8192 },
          discretionaryHyphen: { type: "boolean" },
        },
        required: ["lineEndText", "nextLineStartText", "discretionaryHyphen"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          joinedText: { type: "string", maxLength: 8192 },
          hyphenRemoved: { type: "boolean" },
        },
        required: ["joinedText", "hyphenRemoved"],
      },
      ports: {
        inputs: [
          {
            id: "lineEndText",
            label: "Line End Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "nextLineStartText",
            label: "Next Line Start Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "discretionaryHyphen",
            label: "Discretionary Hyphen",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "joinedText",
            label: "Joined Text",
            valueType: { type: "string" },
          },
          {
            id: "hyphenRemoved",
            label: "Hyphen Removed",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = ocrHyphenJoinMarkerTool.execute;
export default ocrHyphenJoinMarkerTool;
