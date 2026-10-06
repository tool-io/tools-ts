import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latinWording: string;
  readonly englishWording: string;
  readonly terminologySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latinWording: { type: "string", maxLength: 8192, minLength: 1 },
    englishWording: { type: "string", maxLength: 8192, minLength: 1 },
    terminologySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["latinWording", "englishWording", "terminologySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair supplied Latin and English anatomical wording with its source without translating or resolving terminology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latinWording, englishWording, terminologySource } = request;
  const compute = (): Output => {
    H.domain(latinWording.length > 0, "latinWording");
    H.domain(englishWording.length > 0, "englishWording");
    H.domain(terminologySource.length > 0, "terminologySource");
    return {
      token: JSON.stringify([latinWording, englishWording, terminologySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    latinWording: "Terminus A",
    englishWording: "Structure A",
    terminologySource: "Atlas v2",
  },
  output: { token: '["Terminus A","Structure A","Atlas v2"]' },
} satisfies ToolExample<Input, Output>;
export const anatomicalLabelLatinEnglishSourcePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["anatomy", "health and medicine"],
        keywords: ["anatomy", "health and medicine"],
      },
      id: "anatomy/anatomical-label-latin-english-source-pair",
      title: "Anatomical Label Latin English Source Pair",
      description:
        "Pair supplied Latin and English anatomical wording with its source without translating or resolving terminology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latinWording: { type: "string", maxLength: 8192, minLength: 1 },
          englishWording: { type: "string", maxLength: 8192, minLength: 1 },
          terminologySource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["latinWording", "englishWording", "terminologySource"],
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
            id: "latinWording",
            label: "Latin Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "englishWording",
            label: "English Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "terminologySource",
            label: "Terminology Source",
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
export const run = anatomicalLabelLatinEnglishSourcePairTool.execute;
export default anatomicalLabelLatinEnglishSourcePairTool;
