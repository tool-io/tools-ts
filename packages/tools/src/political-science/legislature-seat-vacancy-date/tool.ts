import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seatCode: string;
  readonly vacancyStart: string;
  readonly vacancyEnd: string;
  readonly asOfDate: string;
};
export type Output = { readonly vacant: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatCode: { type: "string", maxLength: 8192 },
    vacancyStart: { type: "string", maxLength: 8192 },
    vacancyEnd: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["seatCode", "vacancyStart", "vacancyEnd", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { vacant: { type: "boolean" } },
  required: ["vacant"],
} as const;
/** Check an explicitly supplied seat-vacancy interval with inclusive start and exclusive end dates; an empty end means open-ended. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seatCode, vacancyStart, vacancyEnd, asOfDate } = request;
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
    H.domain(seatCode.length > 0, "seatCode");
    const a = namedDate(vacancyStart, "vacancyStart").getTime(),
      b =
        vacancyEnd === ""
          ? Infinity
          : namedDate(vacancyEnd, "vacancyEnd").getTime(),
      t = namedDate(asOfDate, "asOfDate").getTime();
    H.domain(b >= a, "");
    return { vacant: t >= a && t < b };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seatCode: "S17",
    vacancyStart: "2026-10-01",
    vacancyEnd: "2026-11-01",
    asOfDate: "2026-10-20",
  },
  output: { vacant: true },
} satisfies ToolExample<Input, Output>;
export const legislatureSeatVacancyDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/legislature-seat-vacancy-date",
    title: "Legislature Seat Vacancy Date Tool",
    description:
      "Check an explicitly supplied seat-vacancy interval with inclusive start and exclusive end dates; an empty end means open-ended.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seatCode: { type: "string", maxLength: 8192 },
        vacancyStart: { type: "string", maxLength: 8192 },
        vacancyEnd: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["seatCode", "vacancyStart", "vacancyEnd", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { vacant: { type: "boolean" } },
      required: ["vacant"],
    },
    ports: {
      inputs: [
        {
          id: "seatCode",
          label: "Seat Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vacancyStart",
          label: "Vacancy Start",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vacancyEnd",
          label: "Vacancy End",
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
        { id: "vacant", label: "Vacant", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = legislatureSeatVacancyDateTool.execute;
export default legislatureSeatVacancyDateTool;
