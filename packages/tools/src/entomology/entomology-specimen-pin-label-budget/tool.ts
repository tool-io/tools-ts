import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lines: readonly string[];
  readonly maximumColumns: number;
  readonly maximumLines: number;
};
export type Output = {
  readonly lineCount: number;
  readonly longestLine: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lines: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    maximumColumns: { type: "integer", minimum: 1 },
    maximumLines: { type: "integer", minimum: 1 },
  },
  required: ["lines", "maximumColumns", "maximumLines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineCount: { type: "integer" },
    longestLine: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["lineCount", "longestLine", "fits"],
} as const;
/** Check an explicit line and Unicode code-point column budget; typography and physical print size are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lines, maximumColumns, maximumLines } = request;
  const compute = (): Output => {
    H.integer(maximumColumns, 1);
    H.integer(maximumLines, 1);
    const widths = lines.map((x) => Array.from(x).length);
    return {
      lineCount: lines.length,
      longestLine: widths.length ? Math.max(...widths) : 0,
      fits:
        lines.length <= maximumLines &&
        widths.every((x) => x <= maximumColumns),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lines: ["Species A", "Site 2"],
    maximumColumns: 12,
    maximumLines: 3,
  },
  output: { lineCount: 2, longestLine: 9, fits: true },
} satisfies ToolExample<Input, Output>;
export const entomologySpecimenPinLabelBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/entomology-specimen-pin-label-budget",
    title: "Entomology Specimen Pin Label Budget Tool",
    description:
      "Check an explicit line and Unicode code-point column budget; typography and physical print size are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lines: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        maximumColumns: { type: "integer", minimum: 1 },
        maximumLines: { type: "integer", minimum: 1 },
      },
      required: ["lines", "maximumColumns", "maximumLines"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineCount: { type: "integer" },
        longestLine: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["lineCount", "longestLine", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "lines",
          label: "Lines",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "maximumColumns",
          label: "Maximum Columns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maximumLines",
          label: "Maximum Lines",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lineCount",
          label: "Line Count",
          valueType: { type: "integer" },
        },
        {
          id: "longestLine",
          label: "Longest Line",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = entomologySpecimenPinLabelBudgetTool.execute;
export default entomologySpecimenPinLabelBudgetTool;
