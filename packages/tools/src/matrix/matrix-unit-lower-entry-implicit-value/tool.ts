import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly row: number;
  readonly column: number;
  readonly storedValue: number;
};
export type Output = { readonly value: number; readonly implicit: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
    storedValue: { type: "number" },
  },
  required: ["row", "column", "storedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, implicit: { type: "boolean" } },
  required: ["value", "implicit"],
} as const;
/** Compute matrix unit lower entry implicit value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, column, storedValue } = input;
  const compute = (): Output => {
    integer(row);
    integer(column);
    return {
      value: row === column ? 1 : row < column ? 0 : storedValue,
      implicit: row <= column,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: 2, column: 2, storedValue: 9 },
  output: { value: 1, implicit: true },
} satisfies ToolExample<Input, Output>;
export const matrixUnitLowerEntryImplicitValueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-unit-lower-entry-implicit-value",
  title: "Matrix Unit Lower Entry Implicit Value Tool",
  description:
    "Compute matrix unit lower entry implicit value from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "row",
        label: "Row",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "column",
        label: "Column",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "storedValue",
        label: "Stored Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "value", label: "Value", valueType: { type: "number" } },
      { id: "implicit", label: "Implicit", valueType: { type: "boolean" } },
    ],
  },
});
export const run = matrixUnitLowerEntryImplicitValueTool.execute;
export default matrixUnitLowerEntryImplicitValueTool;
