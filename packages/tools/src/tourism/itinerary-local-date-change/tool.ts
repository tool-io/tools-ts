import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly departureLocalDate: string;
  readonly arrivalLocalDate: string;
};
export type Output = { readonly calendarDateChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    departureLocalDate: { type: "string", maxLength: 8192 },
    arrivalLocalDate: { type: "string", maxLength: 8192 },
  },
  required: ["departureLocalDate", "arrivalLocalDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calendarDateChange: { type: "integer" } },
  required: ["calendarDateChange"],
} as const;
/** Compare written departure and arrival local dates without interpreting their time zones or treating the difference as elapsed travel duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { departureLocalDate, arrivalLocalDate } = request;
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
    return {
      calendarDateChange:
        (namedDate(arrivalLocalDate, "arrivalLocalDate").getTime() -
          namedDate(departureLocalDate, "departureLocalDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { departureLocalDate: "2026-11-01", arrivalLocalDate: "2026-11-02" },
  output: { calendarDateChange: 1 },
} satisfies ToolExample<Input, Output>;
export const itineraryLocalDateChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/itinerary-local-date-change",
    title: "Itinerary Local Date Change Tool",
    description:
      "Compare written departure and arrival local dates without interpreting their time zones or treating the difference as elapsed travel duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        departureLocalDate: { type: "string", maxLength: 8192 },
        arrivalLocalDate: { type: "string", maxLength: 8192 },
      },
      required: ["departureLocalDate", "arrivalLocalDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { calendarDateChange: { type: "integer" } },
      required: ["calendarDateChange"],
    },
    ports: {
      inputs: [
        {
          id: "departureLocalDate",
          label: "Departure Local Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "arrivalLocalDate",
          label: "Arrival Local Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "calendarDateChange",
          label: "Calendar Date Change",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = itineraryLocalDateChangeTool.execute;
export default itineraryLocalDateChangeTool;
