import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transcription: string;
  readonly annotationType: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transcription: { type: "string", maxLength: 8192 },
    annotationType: {
      type: "string",
      maxLength: 8192,
      enum: ["tone", "vowel-length", "both", "unmarked"],
    },
  },
  required: ["transcription", "annotationType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-declared transcription annotation type without inferring tone or vowel length from a diacritic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transcription, annotationType } = request;
  const compute = (): Output => {
    H.domain(transcription.length > 0, "transcription");
    H.domain(
      ["tone", "vowel-length", "both", "unmarked"].includes(annotationType),
      "annotationType",
    );
    return { label: transcription + " [annotation=" + annotationType + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transcription: "ā", annotationType: "vowel-length" },
  output: { label: "ā [annotation=vowel-length]" },
} satisfies ToolExample<Input, Output>;
export const africanLanguageToneVsVowelLengthAnnotationLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "african-studies/african-language-tone-vs-vowel-length-annotation-label",
      title: "African Language Tone Vs Vowel Length Annotation Label Tool",
      description:
        "Label a caller-declared transcription annotation type without inferring tone or vowel length from a diacritic.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transcription: { type: "string", maxLength: 8192 },
          annotationType: {
            type: "string",
            maxLength: 8192,
            enum: ["tone", "vowel-length", "both", "unmarked"],
          },
        },
        required: ["transcription", "annotationType"],
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
            id: "annotationType",
            label: "Annotation Type",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = africanLanguageToneVsVowelLengthAnnotationLabelTool.execute;
export default africanLanguageToneVsVowelLengthAnnotationLabelTool;
