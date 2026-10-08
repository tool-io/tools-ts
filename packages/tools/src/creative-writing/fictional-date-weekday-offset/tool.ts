import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseWeekday: number;
  readonly offsetDaysDecimal: string;
};
export type Output = { readonly weekday: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseWeekday: { type: "integer", minimum: 0, maximum: 6 },
    offsetDaysDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["baseWeekday", "offsetDaysDecimal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weekday: { type: "integer" } },
  required: ["weekday"],
} as const;
/** Advance a fictional seven-day weekday cycle by an exact signed day count, using caller-defined weekday zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseWeekday, offsetDaysDecimal } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(baseWeekday) && baseWeekday >= 0 && baseWeekday <= 6,
      "baseWeekday",
    ),
      baseWeekday);
    const offset = H.decimal(offsetDaysDecimal);
    const r = (BigInt(baseWeekday) + offset) % 7n;
    return { weekday: Number(r < 0n ? r + 7n : r) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseWeekday: 1, offsetDaysDecimal: "10" },
  output: { weekday: 4 },
} satisfies ToolExample<Input, Output>;
export const fictionalDateWeekdayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/fictional-date-weekday-offset",
    title: "Fictional Date Weekday Offset",
    description:
      "Advance a fictional seven-day weekday cycle by an exact signed day count, using caller-defined weekday zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseWeekday: { type: "integer", minimum: 0, maximum: 6 },
        offsetDaysDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["baseWeekday", "offsetDaysDecimal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weekday: { type: "integer" } },
      required: ["weekday"],
    },
    ports: {
      inputs: [
        {
          id: "baseWeekday",
          label: "Base Weekday",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetDaysDecimal",
          label: "Offset Days Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        { id: "weekday", label: "Weekday", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = fictionalDateWeekdayOffsetTool.execute;
export default fictionalDateWeekdayOffsetTool;
