import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousOpening: string;
  readonly currentOpening: string;
  readonly ignoreCase: boolean;
};
export type Output = { readonly repeated: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousOpening: { type: "string", maxLength: 8192 },
    currentOpening: { type: "string", maxLength: 8192 },
    ignoreCase: { type: "boolean" },
  },
  required: ["previousOpening", "currentOpening", "ignoreCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { repeated: { type: "boolean" } },
  required: ["repeated"],
} as const;
/** Compare two explicitly supplied chapter-opening strings literally or with Unicode default lowercasing, without normalizing punctuation or whitespace. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousOpening, currentOpening, ignoreCase } = request;
  const compute = (): Output => {
    return {
      repeated: ignoreCase
        ? previousOpening.toLowerCase() === currentOpening.toLowerCase()
        : previousOpening === currentOpening,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousOpening: "Once upon a time",
    currentOpening: "Once upon a time",
    ignoreCase: false,
  },
  output: { repeated: true },
} satisfies ToolExample<Input, Output>;
export const chapterOpeningRepeatFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/chapter-opening-repeat-flag",
    title: "Chapter Opening Repeat Flag",
    description:
      "Compare two explicitly supplied chapter-opening strings literally or with Unicode default lowercasing, without normalizing punctuation or whitespace.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousOpening: { type: "string", maxLength: 8192 },
        currentOpening: { type: "string", maxLength: 8192 },
        ignoreCase: { type: "boolean" },
      },
      required: ["previousOpening", "currentOpening", "ignoreCase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { repeated: { type: "boolean" } },
      required: ["repeated"],
    },
    ports: {
      inputs: [
        {
          id: "previousOpening",
          label: "Previous Opening",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentOpening",
          label: "Current Opening",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ignoreCase",
          label: "Ignore Case",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "repeated", label: "Repeated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = chapterOpeningRepeatFlagTool.execute;
export default chapterOpeningRepeatFlagTool;
