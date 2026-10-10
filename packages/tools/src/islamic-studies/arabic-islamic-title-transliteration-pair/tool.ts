import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly originalTitle: string;
  readonly suppliedTransliteration: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    originalTitle: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTransliteration: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "originalTitle", "suppliedTransliteration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an original Arabic title and supplied transliteration under a work identifier without selecting a transliteration system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, originalTitle, suppliedTransliteration } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(originalTitle.length > 0, "originalTitle");
    H.domain(suppliedTransliteration.length > 0, "suppliedTransliteration");
    return {
      token: JSON.stringify([workId, originalTitle, suppliedTransliteration]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workId: "W17",
    originalTitle: "عنوان",
    suppliedTransliteration: "Unwan",
  },
  output: { token: '["W17","عنوان","Unwan"]' },
} satisfies ToolExample<Input, Output>;
export const arabicIslamicTitleTransliterationPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/arabic-islamic-title-transliteration-pair",
      title: "Arabic Islamic Title Transliteration Pair Tool",
      description:
        "Preserve an original Arabic title and supplied transliteration under a work identifier without selecting a transliteration system.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workId: { type: "string", maxLength: 8192, minLength: 1 },
          originalTitle: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTransliteration: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["workId", "originalTitle", "suppliedTransliteration"],
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
            id: "workId",
            label: "Work Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalTitle",
            label: "Original Title",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTransliteration",
            label: "Supplied Transliteration",
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
export const run = arabicIslamicTitleTransliterationPairTool.execute;
export default arabicIslamicTitleTransliterationPairTool;
