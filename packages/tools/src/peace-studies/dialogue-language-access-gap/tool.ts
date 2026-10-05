import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedLanguages: readonly string[];
  readonly supportedLanguages: readonly string[];
};
export type Output = { readonly unsupportedLanguages: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supportedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestedLanguages", "supportedLanguages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unsupportedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["unsupportedLanguages"],
} as const;
/** List exact requested language codes absent from an explicit dialogue support list, preserving request order and removing duplicates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedLanguages, supportedLanguages } = request;
  const compute = (): Output => {
    return {
      unsupportedLanguages: [...new Set(requestedLanguages)].filter(
        (v) => !supportedLanguages.includes(v),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedLanguages: ["en", "fr", "sw"],
    supportedLanguages: ["en", "sw"],
  },
  output: { unsupportedLanguages: ["fr"] },
} satisfies ToolExample<Input, Output>;
export const dialogueLanguageAccessGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/dialogue-language-access-gap",
    title: "Dialogue Language Access Gap Tool",
    description:
      "List exact requested language codes absent from an explicit dialogue support list, preserving request order and removing duplicates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supportedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestedLanguages", "supportedLanguages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unsupportedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["unsupportedLanguages"],
    },
    ports: {
      inputs: [
        {
          id: "requestedLanguages",
          label: "Requested Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supportedLanguages",
          label: "Supported Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unsupportedLanguages",
          label: "Unsupported Languages",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = dialogueLanguageAccessGapTool.execute;
export default dialogueLanguageAccessGapTool;
