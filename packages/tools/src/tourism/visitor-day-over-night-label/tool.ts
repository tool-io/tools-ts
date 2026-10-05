import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalDate: string;
  readonly departureDate: string;
};
export type Output = {
  readonly overnight: boolean;
  readonly nightCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalDate: { type: "string", maxLength: 8192 },
    departureDate: { type: "string", maxLength: 8192 },
  },
  required: ["arrivalDate", "departureDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overnight: { type: "boolean" },
    nightCount: { type: "integer" },
  },
  required: ["overnight", "nightCount"],
} as const;
/** Distinguish a same-date visit from a stay spanning local calendar nights; both dates must already use one locality's calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalDate, departureDate } = request;
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
    const a = namedDate(arrivalDate, "arrivalDate").getTime(),
      b = namedDate(departureDate, "departureDate").getTime();
    H.domain(b >= a, "");
    const nightCount = (b - a) / 86400000;
    return { overnight: nightCount > 0, nightCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalDate: "2026-11-01", departureDate: "2026-11-03" },
  output: { overnight: true, nightCount: 2 },
} satisfies ToolExample<Input, Output>;
export const visitorDayOverNightLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/visitor-day-over-night-label",
    title: "Visitor Day Over Night Label Tool",
    description:
      "Distinguish a same-date visit from a stay spanning local calendar nights; both dates must already use one locality's calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalDate: { type: "string", maxLength: 8192 },
        departureDate: { type: "string", maxLength: 8192 },
      },
      required: ["arrivalDate", "departureDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overnight: { type: "boolean" },
        nightCount: { type: "integer" },
      },
      required: ["overnight", "nightCount"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalDate",
          label: "Arrival Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "departureDate",
          label: "Departure Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "overnight", label: "Overnight", valueType: { type: "boolean" } },
        {
          id: "nightCount",
          label: "Night Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = visitorDayOverNightLabelTool.execute;
export default visitorDayOverNightLabelTool;
