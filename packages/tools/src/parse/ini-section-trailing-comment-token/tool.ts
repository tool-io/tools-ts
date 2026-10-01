import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly line: string };
export type Output = { readonly section: string; readonly comment: string };
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
    section: { type: "string", maxLength: 8192 },
    comment: { type: "string", maxLength: 8192 },
  },
  required: ["section", "comment"],
} as const;
/** Compute ini section trailing comment token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const m = /^\[([^\]\r\n]+)\][ \t]*(?:[;#](.*))?(?![\s\S])/.exec(line);
    domain(m);
    return { section: m[1], comment: m[2] ?? "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "[app] ; settings" },
  output: { section: "app", comment: " settings" },
} satisfies ToolExample<Input, Output>;
export const iniSectionTrailingCommentTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/ini-section-trailing-comment-token",
  title: "Ini Section Trailing Comment Token Tool",
  description:
    "Compute ini section trailing comment token from explicit bounded inputs.",
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
      { id: "section", label: "Section", valueType: { type: "string" } },
      { id: "comment", label: "Comment", valueType: { type: "string" } },
    ],
  },
});
export const run = iniSectionTrailingCommentTokenTool.execute;
export default iniSectionTrailingCommentTokenTool;
