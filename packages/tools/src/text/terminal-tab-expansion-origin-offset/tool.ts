import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly column: number;
  readonly origin: number;
  readonly width: number;
};
export type Output = { readonly nextColumn: number; readonly advance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    column: { type: "integer", minimum: 0 },
    origin: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["column", "origin", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextColumn: { type: "integer" }, advance: { type: "integer" } },
  required: ["nextColumn", "advance"],
} as const;
/** Compute terminal tab expansion origin offset from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { column, origin, width } = input;
  const compute = (): Output => {
    integer(column);
    integer(origin, 0, column);
    integer(width, 1, 256);
    const advance = width - ((column - origin) % width);
    return { nextColumn: column + advance, advance };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { column: 6, origin: 2, width: 4 },
  output: { nextColumn: 10, advance: 4 },
} satisfies ToolExample<Input, Output>;
export const terminalTabExpansionOriginOffsetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/terminal-tab-expansion-origin-offset",
  title: "Terminal Tab Expansion Origin Offset Tool",
  description:
    "Compute terminal tab expansion origin offset from explicit bounded inputs.",
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
        id: "origin",
        label: "Origin",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "nextColumn",
        label: "Next Column",
        valueType: { type: "integer" },
      },
      { id: "advance", label: "Advance", valueType: { type: "integer" } },
    ],
  },
});
export const run = terminalTabExpansionOriginOffsetTool.execute;
export default terminalTabExpansionOriginOffsetTool;
