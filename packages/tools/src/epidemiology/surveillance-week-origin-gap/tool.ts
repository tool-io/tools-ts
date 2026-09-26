import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weekStartDay: number;
  readonly referenceStartDay: number;
  readonly daysPerWeek: number;
};
export type Output = {
  readonly dayGapDecimal: string;
  readonly wholeWeeksDecimal: string;
  readonly aligned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekStartDay: { type: "integer" },
    referenceStartDay: { type: "integer" },
    daysPerWeek: { type: "integer", minimum: 1 },
  },
  required: ["weekStartDay", "referenceStartDay", "daysPerWeek"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayGapDecimal: { type: "string", maxLength: 8192 },
    wholeWeeksDecimal: { type: "string", maxLength: 8192 },
    aligned: { type: "boolean" },
  },
  required: ["dayGapDecimal", "wholeWeeksDecimal", "aligned"],
} as const;
/** Calculate surveillance week origin gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weekStartDay, referenceStartDay, daysPerWeek } = request;
  const compute = (): Output => {
    H.integer(daysPerWeek, 1);
    return (() => {
      const d = BigInt(weekStartDay) - BigInt(referenceStartDay),
        w = BigInt(daysPerWeek);
      return {
        dayGapDecimal: d.toString(),
        wholeWeeksDecimal: (d / w).toString(),
        aligned: d % w === 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weekStartDay: 21, referenceStartDay: 7, daysPerWeek: 7 },
  output: { dayGapDecimal: "14", wholeWeeksDecimal: "2", aligned: true },
} satisfies ToolExample<Input, Output>;
export const surveillanceWeekOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/surveillance-week-origin-gap",
    title: "Surveillance Week Origin Gap Tool",
    description:
      "Calculate surveillance week origin gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekStartDay: { type: "integer" },
        referenceStartDay: { type: "integer" },
        daysPerWeek: { type: "integer", minimum: 1 },
      },
      required: ["weekStartDay", "referenceStartDay", "daysPerWeek"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayGapDecimal: { type: "string", maxLength: 8192 },
        wholeWeeksDecimal: { type: "string", maxLength: 8192 },
        aligned: { type: "boolean" },
      },
      required: ["dayGapDecimal", "wholeWeeksDecimal", "aligned"],
    },
    ports: {
      inputs: [
        {
          id: "weekStartDay",
          label: "Week Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceStartDay",
          label: "Reference Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "daysPerWeek",
          label: "Days Per Week",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "dayGapDecimal",
          label: "Day Gap Decimal",
          valueType: { type: "string" },
        },
        {
          id: "wholeWeeksDecimal",
          label: "Whole Weeks Decimal",
          valueType: { type: "string" },
        },
        { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = surveillanceWeekOriginGapTool.execute;
export default surveillanceWeekOriginGapTool;
