import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly validFromDate: string;
  readonly validThroughDate: string;
  readonly visitDate: string;
};
export type Output = { readonly validOnVisitDate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validFromDate: { type: "string", maxLength: 8192 },
    validThroughDate: { type: "string", maxLength: 8192 },
    visitDate: { type: "string", maxLength: 8192 },
  },
  required: ["validFromDate", "validThroughDate", "visitDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { validOnVisitDate: { type: "boolean" } },
  required: ["validOnVisitDate"],
} as const;
/** Check a museum ticket's explicitly inclusive date-validity window without checking opening hours or entry restrictions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { validFromDate, validThroughDate, visitDate } = request;
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
    const a = namedDate(validFromDate, "validFromDate").getTime(),
      b = namedDate(validThroughDate, "validThroughDate").getTime(),
      t = namedDate(visitDate, "visitDate").getTime();
    H.domain(b >= a, "");
    return { validOnVisitDate: t >= a && t <= b };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    validFromDate: "2026-11-01",
    validThroughDate: "2026-11-03",
    visitDate: "2026-11-03",
  },
  output: { validOnVisitDate: true },
} satisfies ToolExample<Input, Output>;
export const museumTicketValidityWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/museum-ticket-validity-window",
    title: "Museum Ticket Validity Window Tool",
    description:
      "Check a museum ticket's explicitly inclusive date-validity window without checking opening hours or entry restrictions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validFromDate: { type: "string", maxLength: 8192 },
        validThroughDate: { type: "string", maxLength: 8192 },
        visitDate: { type: "string", maxLength: 8192 },
      },
      required: ["validFromDate", "validThroughDate", "visitDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { validOnVisitDate: { type: "boolean" } },
      required: ["validOnVisitDate"],
    },
    ports: {
      inputs: [
        {
          id: "validFromDate",
          label: "Valid From Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "validThroughDate",
          label: "Valid Through Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "visitDate",
          label: "Visit Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "validOnVisitDate",
          label: "Valid On Visit Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = museumTicketValidityWindowTool.execute;
export default museumTicketValidityWindowTool;
