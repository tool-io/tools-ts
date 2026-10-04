import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly column: number; readonly backspaces: number };
export type Output = { readonly column: number; readonly discarded: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "integer", minimum: 0 },
    backspaces: { type: "integer", minimum: 0 },
  },
  required: ["column", "backspaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { column: { type: "integer" }, discarded: { type: "integer" } },
  required: ["column", "discarded"],
} as const;
/** Apply nonwrapping terminal backspaces to an explicit zero-based column, without modifying stored text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { column, backspaces } = request;
  const compute = (): Output => {
    H.integer(column, 0);
    H.integer(backspaces, 0);
    return {
      column: Math.max(0, column - backspaces),
      discarded: Math.max(0, backspaces - column),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { column: 3, backspaces: 5 },
  output: { column: 0, discarded: 2 },
} satisfies ToolExample<Input, Output>;
export const terminalBackspaceCursorFloorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/terminal-backspace-cursor-floor",
    title: "Terminal Backspace Cursor Floor Tool",
    description:
      "Apply nonwrapping terminal backspaces to an explicit zero-based column, without modifying stored text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        column: { type: "integer", minimum: 0 },
        backspaces: { type: "integer", minimum: 0 },
      },
      required: ["column", "backspaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        column: { type: "integer" },
        discarded: { type: "integer" },
      },
      required: ["column", "discarded"],
    },
    ports: {
      inputs: [
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "backspaces",
          label: "Backspaces",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "column", label: "Column", valueType: { type: "integer" } },
        { id: "discarded", label: "Discarded", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = terminalBackspaceCursorFloorTool.execute;
export default terminalBackspaceCursorFloorTool;
