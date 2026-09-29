import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly rowPitch: number;
  readonly columnPitch: number;
  readonly originX: number;
  readonly originY: number;
};
export type Output = { readonly x: number; readonly y: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer" },
    column: { type: "integer" },
    rowPitch: { type: "number", exclusiveMinimum: 0 },
    columnPitch: { type: "number", exclusiveMinimum: 0 },
    originX: { type: "number" },
    originY: { type: "number" },
  },
  required: ["row", "column", "rowPitch", "columnPitch", "originX", "originY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
/** Translate supplied slide-grid indices using explicit pitches and origin, without image registration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, rowPitch, columnPitch, originX, originY } = request;
  const compute = (): Output => {
    H.domain(rowPitch > 0 && columnPitch > 0);
    return { x: originX + column * columnPitch, y: originY + row * rowPitch };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    row: 2,
    column: 3,
    rowPitch: 4,
    columnPitch: 5,
    originX: 1,
    originY: 2,
  },
  output: { x: 16, y: 10 },
} satisfies ToolExample<Input, Output>;
export const slideCoverslipGridOriginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/slide-coverslip-grid-origin",
    title: "Slide Coverslip Grid Origin Tool",
    description:
      "Translate supplied slide-grid indices using explicit pitches and origin, without image registration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer" },
        column: { type: "integer" },
        rowPitch: { type: "number", exclusiveMinimum: 0 },
        columnPitch: { type: "number", exclusiveMinimum: 0 },
        originX: { type: "number" },
        originY: { type: "number" },
      },
      required: [
        "row",
        "column",
        "rowPitch",
        "columnPitch",
        "originX",
        "originY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, y: { type: "number" } },
      required: ["x", "y"],
    },
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
          id: "rowPitch",
          label: "Row Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnPitch",
          label: "Column Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originX",
          label: "Origin X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originY",
          label: "Origin Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = slideCoverslipGridOriginTool.execute;
export default slideCoverslipGridOriginTool;
