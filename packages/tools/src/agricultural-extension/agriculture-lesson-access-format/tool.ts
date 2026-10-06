import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lessonId: string;
  readonly accessFormat: string;
  readonly languageCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lessonId: { type: "string", maxLength: 8192, minLength: 1 },
    accessFormat: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["lessonId", "accessFormat", "languageCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit lesson access format by supplied language code without evaluating accessibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lessonId, accessFormat, languageCode } = request;
  const compute = (): Output => {
    H.domain(lessonId.length > 0, "lessonId");
    H.domain(accessFormat.length > 0, "accessFormat");
    H.domain(languageCode.length > 0, "languageCode");
    return { token: JSON.stringify([lessonId, accessFormat, languageCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lessonId: "LESSON17",
    accessFormat: "large print",
    languageCode: "en",
  },
  output: { token: '["LESSON17","large print","en"]' },
} satisfies ToolExample<Input, Output>;
export const agricultureLessonAccessFormatTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/agriculture-lesson-access-format",
    title: "Agriculture Lesson Access Format",
    description:
      "Qualify an explicit lesson access format by supplied language code without evaluating accessibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lessonId: { type: "string", maxLength: 8192, minLength: 1 },
        accessFormat: { type: "string", maxLength: 8192, minLength: 1 },
        languageCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["lessonId", "accessFormat", "languageCode"],
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
          id: "lessonId",
          label: "Lesson Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accessFormat",
          label: "Access Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agricultureLessonAccessFormatTool.execute;
export default agricultureLessonAccessFormatTool;
