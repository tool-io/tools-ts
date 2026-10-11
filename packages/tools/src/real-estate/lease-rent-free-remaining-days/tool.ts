import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rentFreeStart: string;
  readonly rentFreeEndExclusive: string;
  readonly asOfDate: string;
};
export type Output = {
  readonly remainingDays: number;
  readonly active: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentFreeStart: { type: "string", maxLength: 8192 },
    rentFreeEndExclusive: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["rentFreeStart", "rentFreeEndExclusive", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    active: { type: "boolean" },
  },
  required: ["remainingDays", "active"],
} as const;
/** Count remaining calendar days in a supplied half-open rent-free interval, with future start dates excluded from elapsed time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rentFreeStart, rentFreeEndExclusive, asOfDate } = request;
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
    const a = namedDate(rentFreeStart, "rentFreeStart").getTime(),
      b = namedDate(rentFreeEndExclusive, "rentFreeEndExclusive").getTime(),
      t = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(b >= a, "rentFreeEndExclusive");
    return {
      remainingDays: Math.max(0, (b - Math.max(a, t)) / 86400000),
      active: t >= a && t < b,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rentFreeStart: "2026-11-01",
    rentFreeEndExclusive: "2026-12-01",
    asOfDate: "2026-11-10",
  },
  output: { remainingDays: 21, active: true },
} satisfies ToolExample<Input, Output>;
export const leaseRentFreeRemainingDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/lease-rent-free-remaining-days",
    title: "Lease Rent Free Remaining Days",
    description:
      "Count remaining calendar days in a supplied half-open rent-free interval, with future start dates excluded from elapsed time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rentFreeStart: { type: "string", maxLength: 8192 },
        rentFreeEndExclusive: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["rentFreeStart", "rentFreeEndExclusive", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDays: { type: "integer" },
        active: { type: "boolean" },
      },
      required: ["remainingDays", "active"],
    },
    ports: {
      inputs: [
        {
          id: "rentFreeStart",
          label: "Rent Free Start",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rentFreeEndExclusive",
          label: "Rent Free End Exclusive",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        { id: "active", label: "Active", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = leaseRentFreeRemainingDaysTool.execute;
export default leaseRentFreeRemainingDaysTool;
