import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transcribedLigature: string;
  readonly expansion: string;
  readonly sourceLocator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transcribedLigature: { type: "string", maxLength: 8192 },
    expansion: { type: "string", maxLength: 8192 },
    sourceLocator: { type: "string", maxLength: 8192 },
  },
  required: ["transcribedLigature", "expansion", "sourceLocator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit source-specific ligature transcription and expansion without automatically expanding arbitrary manuscript text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transcribedLigature, expansion, sourceLocator } = request;
  const compute = (): Output => {
    H.domain(
      transcribedLigature.length > 0 &&
        expansion.length > 0 &&
        sourceLocator.length > 0,
      "transcribedLigature",
    );
    return {
      token:
        JSON.stringify(transcribedLigature) +
        " → " +
        JSON.stringify(expansion) +
        " [" +
        sourceLocator +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transcribedLigature: "ﻻ", expansion: "لا", sourceLocator: "12v:3" },
  output: { token: '"ﻻ" → "لا" [12v:3]' },
} satisfies ToolExample<Input, Output>;
export const arabicManuscriptLigatureSourceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "middle-eastern-studies/arabic-manuscript-ligature-source-token",
      title: "Arabic Manuscript Ligature Source Token Tool",
      description:
        "Record an explicit source-specific ligature transcription and expansion without automatically expanding arbitrary manuscript text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transcribedLigature: { type: "string", maxLength: 8192 },
          expansion: { type: "string", maxLength: 8192 },
          sourceLocator: { type: "string", maxLength: 8192 },
        },
        required: ["transcribedLigature", "expansion", "sourceLocator"],
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
            id: "transcribedLigature",
            label: "Transcribed Ligature",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expansion",
            label: "Expansion",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceLocator",
            label: "Source Locator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = arabicManuscriptLigatureSourceTokenTool.execute;
export default arabicManuscriptLigatureSourceTokenTool;
