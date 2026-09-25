import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly original: string;
  readonly regularized: string;
  readonly mode: string;
};
export type Output = { readonly text: string; readonly differs: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    original: { type: "string", maxLength: 8192 },
    regularized: { type: "string", maxLength: 8192 },
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["original", "regularized"],
    },
  },
  required: ["original", "regularized", "mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    differs: { type: "boolean" },
  },
  required: ["text", "differs"],
} as const;
/** Select one explicitly supplied diplomatic or regularized reading without inferring editorial normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { original, regularized, mode } = request;
  const compute = (): Output => {
    H.domain(["original", "regularized"].includes(mode));
    return {
      text: mode === "original" ? original : regularized,
      differs: original !== regularized,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { original: "olde", regularized: "old", mode: "regularized" },
  output: { text: "old", differs: true },
} satisfies ToolExample<Input, Output>;
export const teiChoiceOrigRegOnePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-choice-orig-reg-one-pair",
    title: "TEI Choice Orig Reg One Pair Tool",
    description:
      "Select one explicitly supplied diplomatic or regularized reading without inferring editorial normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        original: { type: "string", maxLength: 8192 },
        regularized: { type: "string", maxLength: 8192 },
        mode: {
          type: "string",
          maxLength: 8192,
          enum: ["original", "regularized"],
        },
      },
      required: ["original", "regularized", "mode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        differs: { type: "boolean" },
      },
      required: ["text", "differs"],
    },
    ports: {
      inputs: [
        {
          id: "original",
          label: "Original",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regularized",
          label: "Regularized",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "text", label: "Text", valueType: { type: "string" } },
        { id: "differs", label: "Differs", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = teiChoiceOrigRegOnePairTool.execute;
export default teiChoiceOrigRegOnePairTool;
