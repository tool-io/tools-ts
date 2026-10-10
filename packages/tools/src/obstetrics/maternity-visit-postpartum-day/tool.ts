import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly birthDate: string; readonly visitDate: string };
export type Output = { readonly signedPostpartumDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthDate: { type: "string", maxLength: 8192 },
    visitDate: { type: "string", maxLength: 8192 },
  },
  required: ["birthDate", "visitDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedPostpartumDays: { type: "number" } },
  required: ["signedPostpartumDays"],
} as const;
/** Count signed calendar days between explicit birth and visit dates without assigning a postpartum care schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthDate, visitDate } = request;
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
      signedPostpartumDays:
        (namedDate(visitDate, "visitDate").getTime() -
          namedDate(birthDate, "birthDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthDate: "2026-10-01", visitDate: "2026-11-01" },
  output: { signedPostpartumDays: 31 },
} satisfies ToolExample<Input, Output>;
export const maternityVisitPostpartumDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/maternity-visit-postpartum-day",
    title: "Maternity Visit Postpartum Day",
    description:
      "Count signed calendar days between explicit birth and visit dates without assigning a postpartum care schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthDate: { type: "string", maxLength: 8192 },
        visitDate: { type: "string", maxLength: 8192 },
      },
      required: ["birthDate", "visitDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedPostpartumDays: { type: "number" } },
      required: ["signedPostpartumDays"],
    },
    ports: {
      inputs: [
        {
          id: "birthDate",
          label: "Birth Date",
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
          id: "signedPostpartumDays",
          label: "Signed Postpartum Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = maternityVisitPostpartumDayTool.execute;
export default maternityVisitPostpartumDayTool;
