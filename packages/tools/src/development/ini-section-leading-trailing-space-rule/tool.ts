import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string; readonly trim: boolean };
export type Output = { readonly name: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line: { type: "string", maxLength: 8192 },
    trim: { type: "boolean" },
  },
  required: ["line", "trim"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { name: { type: "string", maxLength: 8192 } },
  required: ["name"],
} as const;
/** Calculate ini section leading trailing space rule from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { line, trim } = input;
  const compute = (): Output => {
    H.domain(/^\[[^\]\r\n]+\](?![\s\S])/.test(line));
    const name = line.slice(1, -1);
    return { name: trim ? name.trim() : name };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "[ section ]", trim: true },
  output: { name: "section" },
} satisfies ToolExample<Input, Output>;
export const iniSectionLeadingTrailingSpaceRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/ini-section-leading-trailing-space-rule",
    title: "Ini Section Leading Trailing Space Rule Tool",
    description:
      "Calculate ini section leading trailing space rule from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        line: { type: "string", maxLength: 8192 },
        trim: { type: "boolean" },
      },
      required: ["line", "trim"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { name: { type: "string", maxLength: 8192 } },
      required: ["name"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trim",
          label: "Trim",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "name", label: "Name", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = iniSectionLeadingTrailingSpaceRuleTool.execute;
export default iniSectionLeadingTrailingSpaceRuleTool;
