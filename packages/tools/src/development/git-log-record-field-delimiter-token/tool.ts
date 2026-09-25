import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly format: string };
export type Output = {
  readonly nulSeparators: number;
  readonly tabSeparators: number;
  readonly newlineSeparators: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { format: { type: "string", maxLength: 8192 } },
  required: ["format"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nulSeparators: { type: "integer" },
    tabSeparators: { type: "integer" },
    newlineSeparators: { type: "integer" },
  },
  required: ["nulSeparators", "tabSeparators", "newlineSeparators"],
} as const;
/** Compute git log record field delimiter token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { format } = input;
  const compute = (): Output => {
    return {
      nulSeparators: (format.match(/%x00/gi) ?? []).length,
      tabSeparators: (format.match(/%x09/gi) ?? []).length,
      newlineSeparators: (format.match(/%n|%x0a/gi) ?? []).length,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { format: "%H%x00%an%x09%s%n" },
  output: { nulSeparators: 1, tabSeparators: 1, newlineSeparators: 1 },
} satisfies ToolExample<Input, Output>;
export const gitLogRecordFieldDelimiterTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/git-log-record-field-delimiter-token",
  title: "Git Log Record Field Delimiter Token Tool",
  description:
    "Compute git log record field delimiter token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "format",
        label: "Format",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "nulSeparators",
        label: "Nul Separators",
        valueType: { type: "integer" },
      },
      {
        id: "tabSeparators",
        label: "Tab Separators",
        valueType: { type: "integer" },
      },
      {
        id: "newlineSeparators",
        label: "Newline Separators",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = gitLogRecordFieldDelimiterTokenTool.execute;
export default gitLogRecordFieldDelimiterTokenTool;
