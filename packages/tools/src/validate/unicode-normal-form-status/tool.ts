import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string; readonly form: string };
export type Output = { readonly normalized: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    form: {
      type: "string",
      maxLength: 8192,
      enum: ["NFC", "NFD", "NFKC", "NFKD"],
    },
  },
  required: ["text", "form"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "boolean" } },
  required: ["normalized"],
} as const;
/** Calculate unicode normal form status from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, form } = request;
  const compute = (): Output => {
    H.domain(["NFC", "NFD", "NFKC", "NFKD"].includes(form));
    return { normalized: text === text.normalize(form) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "é", form: "NFC" },
  output: { normalized: false },
} satisfies ToolExample<Input, Output>;
export const unicodeNormalFormStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/unicode-normal-form-status",
    title: "Unicode Normal Form Status Tool",
    description:
      "Calculate unicode normal form status from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        form: {
          type: "string",
          maxLength: 8192,
          enum: ["NFC", "NFD", "NFKC", "NFKD"],
        },
      },
      required: ["text", "form"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalized: { type: "boolean" } },
      required: ["normalized"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "form",
          label: "Form",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeNormalFormStatusTool.execute;
export default unicodeNormalFormStatusTool;
