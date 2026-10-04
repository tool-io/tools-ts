import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string; readonly showBreaks: boolean };
export type Output = { readonly text: string; readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    showBreaks: { type: "boolean" },
  },
  required: ["text", "showBreaks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    count: { type: "integer" },
  },
  required: ["text", "count"],
} as const;
/** Calculate plain text soft hyphen visible break from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, showBreaks } = request;
  const compute = (): Output => {
    const count = Array.from(text).filter((c) => c === "\u00ad").length;
    return { text: text.replaceAll("\u00ad", showBreaks ? "-" : ""), count };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "co­operate", showBreaks: true },
  output: { text: "co-operate", count: 1 },
} satisfies ToolExample<Input, Output>;
export const plainTextSoftHyphenVisibleBreakTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/plain-text-soft-hyphen-visible-break",
    title: "Plain Text Soft Hyphen Visible Break Tool",
    description:
      "Calculate plain text soft hyphen visible break from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        showBreaks: { type: "boolean" },
      },
      required: ["text", "showBreaks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        count: { type: "integer" },
      },
      required: ["text", "count"],
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
          id: "showBreaks",
          label: "Show Breaks",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "text", label: "Text", valueType: { type: "string" } },
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = plainTextSoftHyphenVisibleBreakTool.execute;
export default plainTextSoftHyphenVisibleBreakTool;
