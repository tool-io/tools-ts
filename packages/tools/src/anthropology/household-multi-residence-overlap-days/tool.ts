import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStartDate: string;
  readonly firstEndDate: string;
  readonly secondStartDate: string;
  readonly secondEndDate: string;
};
export type Output = { readonly inclusiveOverlapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStartDate: { type: "string", maxLength: 8192 },
    firstEndDate: { type: "string", maxLength: 8192 },
    secondStartDate: { type: "string", maxLength: 8192 },
    secondEndDate: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstStartDate",
    "firstEndDate",
    "secondStartDate",
    "secondEndDate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inclusiveOverlapDays: { type: "integer" } },
  required: ["inclusiveOverlapDays"],
} as const;
/** Count inclusive overlap of two explicitly recorded residence-date intervals without determining residence status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStartDate, firstEndDate, secondStartDate, secondEndDate } =
    request;
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
    H.domain(
      namedDate(firstEndDate, "firstEndDate") >=
        namedDate(firstStartDate, "firstStartDate"),
      "firstEndDate",
    );
    H.domain(
      namedDate(secondEndDate, "secondEndDate") >=
        namedDate(secondStartDate, "secondStartDate"),
      "secondEndDate",
    );
    return {
      inclusiveOverlapDays: Math.max(
        0,
        (Math.min(
          namedDate(firstEndDate, "firstEndDate").getTime(),
          namedDate(secondEndDate, "secondEndDate").getTime(),
        ) -
          Math.max(
            namedDate(firstStartDate, "firstStartDate").getTime(),
            namedDate(secondStartDate, "secondStartDate").getTime(),
          )) /
          86400000 +
          1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStartDate: "2026-10-28",
    firstEndDate: "2026-11-05",
    secondStartDate: "2026-11-01",
    secondEndDate: "2026-11-10",
  },
  output: { inclusiveOverlapDays: 5 },
} satisfies ToolExample<Input, Output>;
export const householdMultiResidenceOverlapDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["anthropology", "social sciences"],
      keywords: ["anthropology", "social sciences"],
    },
    id: "anthropology/household-multi-residence-overlap-days",
    title: "Household Multi Residence Overlap Days",
    description:
      "Count inclusive overlap of two explicitly recorded residence-date intervals without determining residence status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStartDate: { type: "string", maxLength: 8192 },
        firstEndDate: { type: "string", maxLength: 8192 },
        secondStartDate: { type: "string", maxLength: 8192 },
        secondEndDate: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstStartDate",
        "firstEndDate",
        "secondStartDate",
        "secondEndDate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inclusiveOverlapDays: { type: "integer" } },
      required: ["inclusiveOverlapDays"],
    },
    ports: {
      inputs: [
        {
          id: "firstStartDate",
          label: "First Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstEndDate",
          label: "First End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondStartDate",
          label: "Second Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondEndDate",
          label: "Second End Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "inclusiveOverlapDays",
          label: "Inclusive Overlap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdMultiResidenceOverlapDaysTool.execute;
export default householdMultiResidenceOverlapDaysTool;
