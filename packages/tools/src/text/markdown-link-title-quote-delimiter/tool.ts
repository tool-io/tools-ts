import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly title: string };
export type Output = { readonly delimiter: string; readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { title: { type: "string", maxLength: 8192 } },
  required: ["title"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delimiter: { type: "string", maxLength: 8192 },
    token: { type: "string", maxLength: 8192 },
  },
  required: ["delimiter", "token"],
} as const;
/** Compute markdown link title quote delimiter from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { title } = input;
  const compute = (): Output => {
    domain(!/[\r\n]/.test(title));
    const delimiter = !title.includes('"')
      ? '"'
      : !title.includes("\x27")
        ? "\x27"
        : "(";
    domain(delimiter !== "(" || !/[()]/.test(title));
    return {
      delimiter,
      token: delimiter + title + (delimiter === "(" ? ")" : delimiter),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { title: "Report" },
  output: { delimiter: '"', token: '"Report"' },
} satisfies ToolExample<Input, Output>;
export const markdownLinkTitleQuoteDelimiterTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/markdown-link-title-quote-delimiter",
  title: "Markdown Link Title Quote Delimiter Tool",
  description:
    "Compute markdown link title quote delimiter from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "title",
        label: "Title",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "delimiter", label: "Delimiter", valueType: { type: "string" } },
      { id: "token", label: "Token", valueType: { type: "string" } },
    ],
  },
});
export const run = markdownLinkTitleQuoteDelimiterTool.execute;
export default markdownLinkTitleQuoteDelimiterTool;
