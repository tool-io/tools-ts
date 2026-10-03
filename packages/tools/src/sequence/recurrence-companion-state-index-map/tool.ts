import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly order: number;
  readonly row: number;
  readonly column: number;
};
export type Output = {
  readonly shiftEntry: number;
  readonly coefficientRow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    order: { type: "integer", minimum: 1, maximum: 256 },
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
  },
  required: ["order", "row", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftEntry: { type: "integer" },
    coefficientRow: { type: "boolean" },
  },
  required: ["shiftEntry", "coefficientRow"],
} as const;
/** Calculate recurrence companion state index map from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { order, row, column } = request;
  const compute = (): Output => {
    H.integer(order, 1, 256);
    H.integer(row, 0, order - 1);
    H.integer(column, 0, order - 1);
    return {
      shiftEntry: row > 0 && column === row - 1 ? 1 : 0,
      coefficientRow: row === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { order: 4, row: 2, column: 1 },
  output: { shiftEntry: 1, coefficientRow: false },
} satisfies ToolExample<Input, Output>;
export const recurrenceCompanionStateIndexMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/recurrence-companion-state-index-map",
    title: "Recurrence Companion State Index Map Tool",
    description:
      "Calculate recurrence companion state index map from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        order: { type: "integer", minimum: 1, maximum: 256 },
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
      },
      required: ["order", "row", "column"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftEntry: { type: "integer" },
        coefficientRow: { type: "boolean" },
      },
      required: ["shiftEntry", "coefficientRow"],
    },
    ports: {
      inputs: [
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "integer" },
        },
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
      ],
      outputs: [
        {
          id: "shiftEntry",
          label: "Shift Entry",
          valueType: { type: "integer" },
        },
        {
          id: "coefficientRow",
          label: "Coefficient Row",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = recurrenceCompanionStateIndexMapTool.execute;
export default recurrenceCompanionStateIndexMapTool;
