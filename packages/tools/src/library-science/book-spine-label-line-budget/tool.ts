import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spineHeight: number;
  readonly topMargin: number;
  readonly bottomMargin: number;
  readonly lineHeight: number;
  readonly gap: number;
};
export type Output = {
  readonly availableHeight: number;
  readonly lines: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spineHeight: { type: "number" },
    topMargin: { type: "number", minimum: 0 },
    bottomMargin: { type: "number", minimum: 0 },
    lineHeight: { type: "number", exclusiveMinimum: 0 },
    gap: { type: "number", minimum: 0 },
  },
  required: ["spineHeight", "topMargin", "bottomMargin", "lineHeight", "gap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHeight: { type: "number" },
    lines: { type: "integer" },
  },
  required: ["availableHeight", "lines"],
} as const;
/** Count full lines with gaps only between adjacent lines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spineHeight, topMargin, bottomMargin, lineHeight, gap } = request;
  const compute = (): Output => {
    H.domain(
      topMargin >= 0 &&
        bottomMargin >= 0 &&
        spineHeight >= topMargin + bottomMargin &&
        gap >= 0,
    );
    H.positive(lineHeight);
    return {
      availableHeight: spineHeight - topMargin - bottomMargin,
      lines: Math.floor(
        (spineHeight - topMargin - bottomMargin + gap) / (lineHeight + gap),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spineHeight: 100,
    topMargin: 10,
    bottomMargin: 10,
    lineHeight: 10,
    gap: 2,
  },
  output: { availableHeight: 80, lines: 6 },
} satisfies ToolExample<Input, Output>;
export const bookSpineLabelLineBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/book-spine-label-line-budget",
    title: "Book Spine Label Line Budget Tool",
    description: "Count full lines with gaps only between adjacent lines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spineHeight: { type: "number" },
        topMargin: { type: "number", minimum: 0 },
        bottomMargin: { type: "number", minimum: 0 },
        lineHeight: { type: "number", exclusiveMinimum: 0 },
        gap: { type: "number", minimum: 0 },
      },
      required: [
        "spineHeight",
        "topMargin",
        "bottomMargin",
        "lineHeight",
        "gap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableHeight: { type: "number" },
        lines: { type: "integer" },
      },
      required: ["availableHeight", "lines"],
    },
    ports: {
      inputs: [
        {
          id: "spineHeight",
          label: "Spine Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topMargin",
          label: "Top Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomMargin",
          label: "Bottom Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lineHeight",
          label: "Line Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableHeight",
          label: "Available Height",
          valueType: { type: "number" },
        },
        { id: "lines", label: "Lines", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bookSpineLabelLineBudgetTool.execute;
export default bookSpineLabelLineBudgetTool;
