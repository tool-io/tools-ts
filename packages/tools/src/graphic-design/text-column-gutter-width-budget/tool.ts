import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerWidth: number;
  readonly columns: number;
  readonly gutter: number;
  readonly outerInset: number;
};
export type Output = {
  readonly contentWidth: number;
  readonly totalGutters: number;
  readonly columnWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerWidth: { type: "number" },
    columns: { type: "integer", minimum: 1 },
    gutter: { type: "number", minimum: 0 },
    outerInset: { type: "number", minimum: 0 },
  },
  required: ["containerWidth", "columns", "gutter", "outerInset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contentWidth: { type: "number" },
    totalGutters: { type: "number" },
    columnWidth: { type: "number" },
  },
  required: ["contentWidth", "totalGutters", "columnWidth"],
} as const;
/** Calculate text column gutter width budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerWidth, columns, gutter, outerInset } = request;
  const compute = (): Output => {
    H.integer(columns, 1);
    H.domain(
      gutter >= 0 &&
        outerInset >= 0 &&
        containerWidth >= 2 * outerInset + (columns - 1) * gutter,
    );
    return {
      contentWidth: containerWidth - 2 * outerInset,
      totalGutters: (columns - 1) * gutter,
      columnWidth:
        (containerWidth - 2 * outerInset - (columns - 1) * gutter) / columns,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { containerWidth: 600, columns: 3, gutter: 20, outerInset: 10 },
  output: { contentWidth: 580, totalGutters: 40, columnWidth: 180 },
} satisfies ToolExample<Input, Output>;
export const textColumnGutterWidthBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/text-column-gutter-width-budget",
    title: "Text Column Gutter Width Budget Tool",
    description:
      "Calculate text column gutter width budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerWidth: { type: "number" },
        columns: { type: "integer", minimum: 1 },
        gutter: { type: "number", minimum: 0 },
        outerInset: { type: "number", minimum: 0 },
      },
      required: ["containerWidth", "columns", "gutter", "outerInset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contentWidth: { type: "number" },
        totalGutters: { type: "number" },
        columnWidth: { type: "number" },
      },
      required: ["contentWidth", "totalGutters", "columnWidth"],
    },
    ports: {
      inputs: [
        {
          id: "containerWidth",
          label: "Container Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columns",
          label: "Columns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "gutter",
          label: "Gutter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerInset",
          label: "Outer Inset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contentWidth",
          label: "Content Width",
          valueType: { type: "number" },
        },
        {
          id: "totalGutters",
          label: "Total Gutters",
          valueType: { type: "number" },
        },
        {
          id: "columnWidth",
          label: "Column Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = textColumnGutterWidthBudgetTool.execute;
export default textColumnGutterWidthBudgetTool;
