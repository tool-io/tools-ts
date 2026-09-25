import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly lag: number;
  readonly rowCount: number;
};
export type Output = {
  readonly sourceRow: number;
  readonly available: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    lag: { type: "integer" },
    rowCount: { type: "integer", minimum: 1 },
  },
  required: ["row", "lag", "rowCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceRow: { type: "integer" },
    available: { type: "boolean" },
  },
  required: ["sourceRow", "available"],
} as const;
/** Positional lag on an already ordered calendar-row table; missing calendar periods must be represented explicitly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, lag, rowCount } = request;
  const compute = (): Output => {
    H.integer(rowCount, 1);
    H.integer(row, 0, rowCount - 1);
    return {
      sourceRow: row - lag,
      available: row - lag >= 0 && row - lag < rowCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 5, lag: 2, rowCount: 10 },
  output: { sourceRow: 3, available: true },
} satisfies ToolExample<Input, Output>;
export const featureLagCalendarRowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-lag-calendar-row-offset",
    title: "Feature Lag Calendar Row Offset Tool",
    description:
      "Positional lag on an already ordered calendar-row table; missing calendar periods must be represented explicitly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        lag: { type: "integer" },
        rowCount: { type: "integer", minimum: 1 },
      },
      required: ["row", "lag", "rowCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceRow: { type: "integer" },
        available: { type: "boolean" },
      },
      required: ["sourceRow", "available"],
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
          id: "lag",
          label: "Lag",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowCount",
          label: "Row Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sourceRow",
          label: "Source Row",
          valueType: { type: "integer" },
        },
        { id: "available", label: "Available", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = featureLagCalendarRowOffsetTool.execute;
export default featureLagCalendarRowOffsetTool;
