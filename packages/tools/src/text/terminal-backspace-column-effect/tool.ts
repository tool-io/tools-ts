import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly column: number; readonly count: number };
export type Output = { readonly column: number; readonly discarded: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "integer", minimum: 0 },
    count: { type: "integer", minimum: 0 },
  },
  required: ["column", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { column: { type: "integer" }, discarded: { type: "integer" } },
  required: ["column", "discarded"],
} as const;
/** Compute terminal backspace column effect from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { column, count } = input;
  const compute = (): Output => {
    integer(column);
    integer(count);
    return {
      column: Math.max(0, column - count),
      discarded: Math.max(0, count - column),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { column: 3, count: 5 },
  output: { column: 0, discarded: 2 },
} satisfies ToolExample<Input, Output>;
export const terminalBackspaceColumnEffectTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/terminal-backspace-column-effect",
  title: "Terminal Backspace Column Effect Tool",
  description:
    "Compute terminal backspace column effect from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "column",
        label: "Column",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "count",
        label: "Count",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "column", label: "Column", valueType: { type: "integer" } },
      { id: "discarded", label: "Discarded", valueType: { type: "integer" } },
    ],
  },
});
export const run = terminalBackspaceColumnEffectTool.execute;
export default terminalBackspaceColumnEffectTool;
