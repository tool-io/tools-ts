import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly section: string };
export type Output = { readonly pattern: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { section: { type: "string", maxLength: 8192 } },
  required: ["section"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pattern: { type: "string", maxLength: 8192 } },
  required: ["pattern"],
} as const;
/** Compute editorconfig section glob bracket token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { section } = input;
  const compute = (): Output => {
    domain(/^\[[^\r\n]+\](?![\s\S])/.test(section));
    return { pattern: section.slice(1, -1) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { section: "[*.{js,ts}]" },
  output: { pattern: "*.{js,ts}" },
} satisfies ToolExample<Input, Output>;
export const editorconfigSectionGlobBracketTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/editorconfig-section-glob-bracket-token",
  title: "EditorConfig Section Glob Bracket Token Tool",
  description:
    "Compute editorconfig section glob bracket token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "section",
        label: "Section",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "pattern", label: "Pattern", valueType: { type: "string" } },
    ],
  },
});
export const run = editorconfigSectionGlobBracketTokenTool.execute;
export default editorconfigSectionGlobBracketTokenTool;
