import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDate: string;
  readonly returnDate: string;
  readonly countReturnDay: boolean;
};
export type Output = { readonly rentalDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDate: { type: "string", maxLength: 8192 },
    returnDate: { type: "string", maxLength: 8192 },
    countReturnDay: { type: "boolean" },
  },
  required: ["startDate", "returnDate", "countReturnDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rentalDays: { type: "integer" } },
  required: ["rentalDays"],
} as const;
/** Count recorded scaffold rental calendar days under an explicit return-day inclusion convention without selecting supplier billing terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDate, returnDate, countReturnDay } = request;
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
    const a = namedDate(startDate, "startDate").getTime(),
      b = namedDate(returnDate, "returnDate").getTime();
    H.domain(b >= a, "returnDate");
    return { rentalDays: (b - a) / 86400000 + (countReturnDay ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startDate: "2026-11-01",
    returnDate: "2026-11-04",
    countReturnDay: true,
  },
  output: { rentalDays: 4 },
} satisfies ToolExample<Input, Output>;
export const scaffoldRentalDayCountInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/scaffold-rental-day-count-input",
    title: "Scaffold Rental Day Count Input",
    description:
      "Count recorded scaffold rental calendar days under an explicit return-day inclusion convention without selecting supplier billing terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDate: { type: "string", maxLength: 8192 },
        returnDate: { type: "string", maxLength: 8192 },
        countReturnDay: { type: "boolean" },
      },
      required: ["startDate", "returnDate", "countReturnDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rentalDays: { type: "integer" } },
      required: ["rentalDays"],
    },
    ports: {
      inputs: [
        {
          id: "startDate",
          label: "Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "returnDate",
          label: "Return Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "countReturnDay",
          label: "Count Return Day",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rentalDays",
          label: "Rental Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldRentalDayCountInputTool.execute;
export default scaffoldRentalDayCountInputTool;
