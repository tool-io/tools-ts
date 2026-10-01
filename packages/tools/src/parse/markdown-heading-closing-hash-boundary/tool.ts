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
  readonly content: string;
  readonly closingHashes: number;
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
    content: { type: "string", maxLength: 8192 },
    closingHashes: { type: "integer" },
  },
  required: ["content", "closingHashes"],
} as const;
/** Compute markdown heading closing hash boundary from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const m = /^ {0,3}#{1,6}(?:[ \t]+|$)(.*)(?![\s\S])/.exec(line);
    domain(m);
    const tail = /[ \t]+(#+)[ \t]*(?![\s\S])/.exec(m[1]);
    return {
      content: tail ? m[1].slice(0, tail.index).trim() : m[1].trim(),
      closingHashes: tail ? tail[1].length : 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "## Heading ##" },
  output: { content: "Heading", closingHashes: 2 },
} satisfies ToolExample<Input, Output>;
export const markdownHeadingClosingHashBoundaryTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/markdown-heading-closing-hash-boundary",
  title: "Markdown Heading Closing Hash Boundary Tool",
  description:
    "Compute markdown heading closing hash boundary from explicit bounded inputs.",
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
      { id: "content", label: "Content", valueType: { type: "string" } },
      {
        id: "closingHashes",
        label: "Closing Hashes",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = markdownHeadingClosingHashBoundaryTool.execute;
export default markdownHeadingClosingHashBoundaryTool;
