import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMinute: number;
  readonly closingMinute: number;
  readonly breaks: readonly number[];
};
export type Output = {
  readonly grossMinutes: number;
  readonly openMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMinute: { type: "number" },
    closingMinute: { type: "number" },
    breaks: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["openingMinute", "closingMinute", "breaks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMinutes: { type: "number" },
    openMinutes: { type: "number" },
  },
  required: ["grossMinutes", "openMinutes"],
} as const;
/** Subtract supplied disjoint break durations; dates and overnight intervals must be unfolded by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMinute, closingMinute, breaks } = request;
  const compute = (): Output => {
    H.domain(
      closingMinute >= openingMinute &&
        breaks.every((x) => x >= 0) &&
        breaks.reduce((a, b) => a + b, 0) <= closingMinute - openingMinute,
    );
    return {
      grossMinutes: closingMinute - openingMinute,
      openMinutes:
        closingMinute - openingMinute - breaks.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingMinute: 540, closingMinute: 1020, breaks: [30, 15] },
  output: { grossMinutes: 480, openMinutes: 435 },
} satisfies ToolExample<Input, Output>;
export const publicCounterOpenHoursNetBreakTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/public-counter-open-hours-net-break",
    title: "Public Counter Open Hours Net Break Tool",
    description:
      "Subtract supplied disjoint break durations; dates and overnight intervals must be unfolded by the caller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingMinute: { type: "number" },
        closingMinute: { type: "number" },
        breaks: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["openingMinute", "closingMinute", "breaks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMinutes: { type: "number" },
        openMinutes: { type: "number" },
      },
      required: ["grossMinutes", "openMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "openingMinute",
          label: "Opening Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closingMinute",
          label: "Closing Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breaks",
          label: "Breaks",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "grossMinutes",
          label: "Gross Minutes",
          valueType: { type: "number" },
        },
        {
          id: "openMinutes",
          label: "Open Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCounterOpenHoursNetBreakTool.execute;
export default publicCounterOpenHoursNetBreakTool;
