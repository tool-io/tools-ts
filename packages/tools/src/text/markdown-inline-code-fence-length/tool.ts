import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly code: string };
export type Output = { readonly fence: string; readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fence: { type: "string", maxLength: 8192 },
    length: { type: "integer" },
  },
  required: ["fence", "length"],
} as const;
/** Compute markdown inline code fence length from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { code } = input;
  const compute = (): Output => {
    const runs = code.match(/`+/g) ?? [];
    const length = Math.max(0, ...runs.map((x) => x.length)) + 1;
    domain(length <= 8192);
    return { fence: "`".repeat(length), length };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { code: "a``b" },
  output: { fence: "```", length: 3 },
} satisfies ToolExample<Input, Output>;
export const markdownInlineCodeFenceLengthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/markdown-inline-code-fence-length",
  title: "Markdown Inline Code Fence Length Tool",
  description:
    "Compute markdown inline code fence length from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "fence", label: "Fence", valueType: { type: "string" } },
      { id: "length", label: "Length", valueType: { type: "integer" } },
    ],
  },
});
export const run = markdownInlineCodeFenceLengthTool.execute;
export default markdownInlineCodeFenceLengthTool;
