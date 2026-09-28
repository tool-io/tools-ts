import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gutterWidth: number;
  readonly columnWidth: number;
};
export type Output = { readonly gutterToColumnRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gutterWidth: { type: "number", minimum: 0 },
    columnWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gutterWidth", "columnWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gutterToColumnRatio: { type: "number" } },
  required: ["gutterToColumnRatio"],
} as const;
/** Report a measured gutter-to-column width ratio without allocating a grid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gutterWidth, columnWidth } = request;
  const compute = (): Output => {
    H.domain(gutterWidth >= 0);
    H.positive(columnWidth);
    return { gutterToColumnRatio: gutterWidth / columnWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gutterWidth: 2, columnWidth: 8 },
  output: { gutterToColumnRatio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const gridGutterPerColumnShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/grid-gutter-per-column-share",
    title: "Grid Gutter Per Column Share Tool",
    description:
      "Report a measured gutter-to-column width ratio without allocating a grid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gutterWidth: { type: "number", minimum: 0 },
        columnWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["gutterWidth", "columnWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gutterToColumnRatio: { type: "number" } },
      required: ["gutterToColumnRatio"],
    },
    ports: {
      inputs: [
        {
          id: "gutterWidth",
          label: "Gutter Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnWidth",
          label: "Column Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gutterToColumnRatio",
          label: "Gutter To Column Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gridGutterPerColumnShareTool.execute;
export default gridGutterPerColumnShareTool;
