import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventDate: string;
  readonly originDate: string;
  readonly binWidthDays: number;
};
export type Output = {
  readonly binIndex: number;
  readonly binStartDate: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventDate: { type: "string", maxLength: 8192 },
    originDate: { type: "string", maxLength: 8192 },
    binWidthDays: { type: "integer", minimum: 1, maximum: 3652425 },
  },
  required: ["eventDate", "originDate", "binWidthDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binIndex: { type: "integer" },
    binStartDate: { type: "string", maxLength: 8192 },
  },
  required: ["binIndex", "binStartDate"],
} as const;
/** Assign a date to an explicitly anchored fixed-day epidemic-curve bin using floor and a half-open bin convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventDate, originDate, binWidthDays } = request;
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
    (H.domain(
      Number.isSafeInteger(binWidthDays) &&
        binWidthDays >= 1 &&
        binWidthDays <= 3652425,
      "binWidthDays",
    ),
      binWidthDays);
    const event = namedDate(eventDate, "eventDate"),
      origin = namedDate(originDate, "originDate");
    const binIndex = Math.floor(
      (event.getTime() - origin.getTime()) / 86400000 / binWidthDays,
    );
    const start = new Date(
      origin.getTime() + binIndex * binWidthDays * 86400000,
    );
    H.domain(
      Number.isFinite(start.getTime()) &&
        start.getUTCFullYear() >= 0 &&
        start.getUTCFullYear() <= 9999,
      "eventDate",
    );
    return { binIndex, binStartDate: start.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventDate: "2026-01-10", originDate: "2026-01-01", binWidthDays: 7 },
  output: { binIndex: 1, binStartDate: "2026-01-08" },
} satisfies ToolExample<Input, Output>;
export const epidemicCurveBinDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/epidemic-curve-bin-date",
    title: "Epidemic Curve Bin Date",
    description:
      "Assign a date to an explicitly anchored fixed-day epidemic-curve bin using floor and a half-open bin convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventDate: { type: "string", maxLength: 8192 },
        originDate: { type: "string", maxLength: 8192 },
        binWidthDays: { type: "integer", minimum: 1, maximum: 3652425 },
      },
      required: ["eventDate", "originDate", "binWidthDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binIndex: { type: "integer" },
        binStartDate: { type: "string", maxLength: 8192 },
      },
      required: ["binIndex", "binStartDate"],
    },
    ports: {
      inputs: [
        {
          id: "eventDate",
          label: "Event Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originDate",
          label: "Origin Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "binWidthDays",
          label: "Bin Width Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "binIndex", label: "Bin Index", valueType: { type: "integer" } },
        {
          id: "binStartDate",
          label: "Bin Start Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = epidemicCurveBinDateTool.execute;
export default epidemicCurveBinDateTool;
