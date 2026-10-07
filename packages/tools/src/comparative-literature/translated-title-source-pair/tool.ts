import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalTitle: string;
  readonly translatedTitle: string;
  readonly sourceEdition: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalTitle: { type: "string", maxLength: 8192, minLength: 1 },
    translatedTitle: { type: "string", maxLength: 8192, minLength: 1 },
    sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["originalTitle", "translatedTitle", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Pair literal original and translated titles with an explicit source-edition label without generating a translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalTitle, translatedTitle, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(
      originalTitle.length > 0 &&
        translatedTitle.length > 0 &&
        sourceEdition.length > 0,
      "originalTitle",
    );
    return {
      label:
        originalTitle + " / " + translatedTitle + " [" + sourceEdition + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalTitle: "Original Work",
    translatedTitle: "Translated Work",
    sourceEdition: "Edition A",
  },
  output: { label: "Original Work / Translated Work [Edition A]" },
} satisfies ToolExample<Input, Output>;
export const translatedTitleSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/translated-title-source-pair",
    title: "Translated Title Source Pair",
    description:
      "Pair literal original and translated titles with an explicit source-edition label without generating a translation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalTitle: { type: "string", maxLength: 8192, minLength: 1 },
        translatedTitle: { type: "string", maxLength: 8192, minLength: 1 },
        sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["originalTitle", "translatedTitle", "sourceEdition"],
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
          id: "originalTitle",
          label: "Original Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "translatedTitle",
          label: "Translated Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = translatedTitleSourcePairTool.execute;
export default translatedTitleSourcePairTool;
