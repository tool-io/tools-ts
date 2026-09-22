import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEarliestDate: string;
  readonly firstLatestDate: string;
  readonly secondEarliestDate: string;
  readonly secondLatestDate: string;
};
export type Output = {
  readonly minimumGapDays: number;
  readonly maximumGapDays: number;
  readonly orderingCertain: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEarliestDate: { type: "string", maxLength: 8192 },
    firstLatestDate: { type: "string", maxLength: 8192 },
    secondEarliestDate: { type: "string", maxLength: 8192 },
    secondLatestDate: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstEarliestDate",
    "firstLatestDate",
    "secondEarliestDate",
    "secondLatestDate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumGapDays: { type: "integer" },
    maximumGapDays: { type: "integer" },
    orderingCertain: { type: "boolean" },
  },
  required: ["minimumGapDays", "maximumGapDays", "orderingCertain"],
} as const;
/** Calculate publication date precision gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstEarliestDate,
    firstLatestDate,
    secondEarliestDate,
    secondLatestDate,
  } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(firstEarliestDate).getTime(),
        b = H.dateOnly(firstLatestDate).getTime(),
        c = H.dateOnly(secondEarliestDate).getTime(),
        d = H.dateOnly(secondLatestDate).getTime();
      H.domain(a <= b && c <= d);
      return {
        minimumGapDays: (c - b) / 86400000,
        maximumGapDays: (d - a) / 86400000,
        orderingCertain: c > b || a > d,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEarliestDate: "2024-01-01",
    firstLatestDate: "2024-01-03",
    secondEarliestDate: "2024-01-05",
    secondLatestDate: "2024-01-06",
  },
  output: { minimumGapDays: 2, maximumGapDays: 5, orderingCertain: true },
} satisfies ToolExample<Input, Output>;
export const publicationDatePrecisionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/publication-date-precision-gap",
    title: "Publication Date Precision Gap Tool",
    description:
      "Calculate publication date precision gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEarliestDate: { type: "string", maxLength: 8192 },
        firstLatestDate: { type: "string", maxLength: 8192 },
        secondEarliestDate: { type: "string", maxLength: 8192 },
        secondLatestDate: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstEarliestDate",
        "firstLatestDate",
        "secondEarliestDate",
        "secondLatestDate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumGapDays: { type: "integer" },
        maximumGapDays: { type: "integer" },
        orderingCertain: { type: "boolean" },
      },
      required: ["minimumGapDays", "maximumGapDays", "orderingCertain"],
    },
    ports: {
      inputs: [
        {
          id: "firstEarliestDate",
          label: "First Earliest Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstLatestDate",
          label: "First Latest Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondEarliestDate",
          label: "Second Earliest Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondLatestDate",
          label: "Second Latest Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "minimumGapDays",
          label: "Minimum Gap Days",
          valueType: { type: "integer" },
        },
        {
          id: "maximumGapDays",
          label: "Maximum Gap Days",
          valueType: { type: "integer" },
        },
        {
          id: "orderingCertain",
          label: "Ordering Certain",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicationDatePrecisionGapTool.execute;
export default publicationDatePrecisionGapTool;
