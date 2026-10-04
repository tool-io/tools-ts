import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly line: string };
export type Output = {
  readonly trailingSpaces: number;
  readonly hardBreak: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trailingSpaces: { type: "integer" },
    hardBreak: { type: "boolean" },
  },
  required: ["trailingSpaces", "hardBreak"],
} as const;
/** Compute markdown hardbreak trailing spaces count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    domain(!/[\r\n]/.test(line));
    const trailingSpaces = (line.match(/ *(?![\s\S])/) ?? [""])[0].length;
    return { trailingSpaces, hardBreak: trailingSpaces >= 2 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "hello  " },
  output: { trailingSpaces: 2, hardBreak: true },
} satisfies ToolExample<Input, Output>;
export const markdownHardbreakTrailingSpacesCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/markdown-hardbreak-trailing-spaces-count",
  title: "Markdown Hardbreak Trailing Spaces Count Tool",
  description:
    "Compute markdown hardbreak trailing spaces count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "line",
        label: "Line",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "trailingSpaces",
        label: "Trailing Spaces",
        valueType: { type: "integer" },
      },
      { id: "hardBreak", label: "Hard Break", valueType: { type: "boolean" } },
    ],
  },
});
export const run = markdownHardbreakTrailingSpacesCountTool.execute;
export default markdownHardbreakTrailingSpacesCountTool;
