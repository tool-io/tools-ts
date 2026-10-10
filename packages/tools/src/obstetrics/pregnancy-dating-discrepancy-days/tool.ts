import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEstimatedDate: string;
  readonly secondEstimatedDate: string;
};
export type Output = {
  readonly secondMinusFirstDays: number;
  readonly absoluteDiscrepancyDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEstimatedDate: { type: "string", maxLength: 8192 },
    secondEstimatedDate: { type: "string", maxLength: 8192 },
  },
  required: ["firstEstimatedDate", "secondEstimatedDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondMinusFirstDays: { type: "number" },
    absoluteDiscrepancyDays: { type: "number" },
  },
  required: ["secondMinusFirstDays", "absoluteDiscrepancyDays"],
} as const;
/** Compare two explicitly supplied pregnancy date estimates without deciding which estimate to use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEstimatedDate, secondEstimatedDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return (() => {
      const secondMinusFirstDays =
        (namedDate(secondEstimatedDate, "secondEstimatedDate").getTime() -
          namedDate(firstEstimatedDate, "firstEstimatedDate").getTime()) /
        86400000;
      return {
        secondMinusFirstDays,
        absoluteDiscrepancyDays: Math.abs(secondMinusFirstDays),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEstimatedDate: "2027-01-10",
    secondEstimatedDate: "2027-01-15",
  },
  output: { secondMinusFirstDays: 5, absoluteDiscrepancyDays: 5 },
} satisfies ToolExample<Input, Output>;
export const pregnancyDatingDiscrepancyDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/pregnancy-dating-discrepancy-days",
    title: "Pregnancy Dating Discrepancy Days",
    description:
      "Compare two explicitly supplied pregnancy date estimates without deciding which estimate to use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEstimatedDate: { type: "string", maxLength: 8192 },
        secondEstimatedDate: { type: "string", maxLength: 8192 },
      },
      required: ["firstEstimatedDate", "secondEstimatedDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondMinusFirstDays: { type: "number" },
        absoluteDiscrepancyDays: { type: "number" },
      },
      required: ["secondMinusFirstDays", "absoluteDiscrepancyDays"],
    },
    ports: {
      inputs: [
        {
          id: "firstEstimatedDate",
          label: "First Estimated Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondEstimatedDate",
          label: "Second Estimated Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "secondMinusFirstDays",
          label: "Second Minus First Days",
          valueType: { type: "number" },
        },
        {
          id: "absoluteDiscrepancyDays",
          label: "Absolute Discrepancy Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pregnancyDatingDiscrepancyDaysTool.execute;
export default pregnancyDatingDiscrepancyDaysTool;
