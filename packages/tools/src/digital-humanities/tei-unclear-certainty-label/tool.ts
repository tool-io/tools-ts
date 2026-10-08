import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transcription: string;
  readonly certainty: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transcription: { type: "string", maxLength: 8192, minLength: 1 },
    certainty: {
      type: "string",
      maxLength: 8192,
      enum: ["high", "medium", "low", "unknown"],
    },
  },
  required: ["transcription", "certainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit unclear-transcription certainty annotation without inferring a reading or producing a complete TEI element. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transcription, certainty } = request;
  const compute = (): Output => {
    H.domain(transcription.length > 0, "transcription");
    H.domain(
      ["high", "medium", "low", "unknown"].includes(certainty),
      "certainty",
    );
    return {
      label:
        JSON.stringify(transcription) +
        " [unclear; certainty=" +
        certainty +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transcription: "word", certainty: "low" },
  output: { label: '"word" [unclear; certainty=low]' },
} satisfies ToolExample<Input, Output>;
export const teiUnclearCertaintyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/tei-unclear-certainty-label",
    title: "TEI Unclear Certainty Label",
    description:
      "Label an explicit unclear-transcription certainty annotation without inferring a reading or producing a complete TEI element.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transcription: { type: "string", maxLength: 8192, minLength: 1 },
        certainty: {
          type: "string",
          maxLength: 8192,
          enum: ["high", "medium", "low", "unknown"],
        },
      },
      required: ["transcription", "certainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "transcription",
          label: "Transcription",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "certainty",
          label: "Certainty",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = teiUnclearCertaintyLabelTool.execute;
export default teiUnclearCertaintyLabelTool;
