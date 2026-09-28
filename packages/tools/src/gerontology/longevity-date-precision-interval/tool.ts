import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthEarliest: number;
  readonly birthLatest: number;
  readonly endEarliest: number;
  readonly endLatest: number;
};
export type Output = {
  readonly minimumDays: number;
  readonly maximumDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthEarliest: { type: "integer" },
    birthLatest: { type: "integer" },
    endEarliest: { type: "integer" },
    endLatest: { type: "integer" },
  },
  required: ["birthEarliest", "birthLatest", "endEarliest", "endLatest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumDays: { type: "integer" },
    maximumDays: { type: "integer" },
  },
  required: ["minimumDays", "maximumDays"],
} as const;
/** Elapsed-day envelope from supplied nonoverlapping birth/end date intervals; no longevity forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthEarliest, birthLatest, endEarliest, endLatest } = request;
  const compute = (): Output => {
    H.domain(
      birthLatest >= birthEarliest &&
        endLatest >= endEarliest &&
        endEarliest >= birthLatest,
    );
    return {
      minimumDays: endEarliest - birthLatest,
      maximumDays: endLatest - birthEarliest,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    birthEarliest: 10,
    birthLatest: 20,
    endEarliest: 100,
    endLatest: 110,
  },
  output: { minimumDays: 80, maximumDays: 100 },
} satisfies ToolExample<Input, Output>;
export const longevityDatePrecisionIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/longevity-date-precision-interval",
    title: "Longevity Date Precision Interval Tool",
    description:
      "Elapsed-day envelope from supplied nonoverlapping birth/end date intervals; no longevity forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthEarliest: { type: "integer" },
        birthLatest: { type: "integer" },
        endEarliest: { type: "integer" },
        endLatest: { type: "integer" },
      },
      required: ["birthEarliest", "birthLatest", "endEarliest", "endLatest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumDays: { type: "integer" },
        maximumDays: { type: "integer" },
      },
      required: ["minimumDays", "maximumDays"],
    },
    ports: {
      inputs: [
        {
          id: "birthEarliest",
          label: "Birth Earliest",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthLatest",
          label: "Birth Latest",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endEarliest",
          label: "End Earliest",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endLatest",
          label: "End Latest",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "minimumDays",
          label: "Minimum Days",
          valueType: { type: "integer" },
        },
        {
          id: "maximumDays",
          label: "Maximum Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = longevityDatePrecisionIntervalTool.execute;
export default longevityDatePrecisionIntervalTool;
