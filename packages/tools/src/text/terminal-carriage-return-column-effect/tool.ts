import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly column: number };
export type Output = { readonly column: number; readonly moved: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { column: { type: "integer", minimum: 0 } },
  required: ["column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { column: { type: "integer" }, moved: { type: "integer" } },
  required: ["column", "moved"],
} as const;
/** Compute terminal carriage return column effect from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { column } = input;
  const compute = (): Output => {
    integer(column);
    return { column: 0, moved: column };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { column: 12 },
  output: { column: 0, moved: 12 },
} satisfies ToolExample<Input, Output>;
export const terminalCarriageReturnColumnEffectTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/terminal-carriage-return-column-effect",
  title: "Terminal Carriage Return Column Effect Tool",
  description:
    "Compute terminal carriage return column effect from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "column", label: "Column", valueType: { type: "integer" } },
      { id: "moved", label: "Moved", valueType: { type: "integer" } },
    ],
  },
});
export const run = terminalCarriageReturnColumnEffectTool.execute;
export default terminalCarriageReturnColumnEffectTool;
