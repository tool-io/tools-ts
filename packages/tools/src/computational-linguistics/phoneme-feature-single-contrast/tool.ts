import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSymbol: string;
  readonly secondSymbol: string;
  readonly featureName: string;
  readonly firstValue: string;
  readonly secondValue: string;
};
export type Output = { readonly contrasts: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSymbol: { type: "string", maxLength: 8192, minLength: 1 },
    secondSymbol: { type: "string", maxLength: 8192, minLength: 1 },
    featureName: { type: "string", maxLength: 8192, minLength: 1 },
    firstValue: { type: "string", maxLength: 8192 },
    secondValue: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstSymbol",
    "secondSymbol",
    "featureName",
    "firstValue",
    "secondValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contrasts: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["contrasts", "label"],
} as const;
/** Compare one explicitly supplied phoneme-feature value pair without inferring a phonological feature system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSymbol, secondSymbol, featureName, firstValue, secondValue } =
    request;
  const compute = (): Output => {
    H.domain(
      firstSymbol.length > 0 &&
        secondSymbol.length > 0 &&
        featureName.length > 0,
      "firstSymbol",
    );
    return {
      contrasts: firstValue !== secondValue,
      label:
        firstSymbol +
        "/" +
        secondSymbol +
        "; " +
        featureName +
        ": " +
        firstValue +
        " → " +
        secondValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSymbol: "p",
    secondSymbol: "b",
    featureName: "voice",
    firstValue: "-",
    secondValue: "+",
  },
  output: { contrasts: true, label: "p/b; voice: - → +" },
} satisfies ToolExample<Input, Output>;
export const phonemeFeatureSingleContrastTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/phoneme-feature-single-contrast",
    title: "Phoneme Feature Single Contrast",
    description:
      "Compare one explicitly supplied phoneme-feature value pair without inferring a phonological feature system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSymbol: { type: "string", maxLength: 8192, minLength: 1 },
        secondSymbol: { type: "string", maxLength: 8192, minLength: 1 },
        featureName: { type: "string", maxLength: 8192, minLength: 1 },
        firstValue: { type: "string", maxLength: 8192 },
        secondValue: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstSymbol",
        "secondSymbol",
        "featureName",
        "firstValue",
        "secondValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contrasts: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["contrasts", "label"],
    },
    ports: {
      inputs: [
        {
          id: "firstSymbol",
          label: "First Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondSymbol",
          label: "Second Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "featureName",
          label: "Feature Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstValue",
          label: "First Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondValue",
          label: "Second Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "contrasts", label: "Contrasts", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = phonemeFeatureSingleContrastTool.execute;
export default phonemeFeatureSingleContrastTool;
