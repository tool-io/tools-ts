import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactDate: string;
  readonly suppliedShiftDays: number;
};
export type Output = { readonly shiftedDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactDate: { type: "string", maxLength: 8192 },
    suppliedShiftDays: { type: "integer" },
  },
  required: ["contactDate", "suppliedShiftDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shiftedDate: { type: "string", maxLength: 8192 } },
  required: ["shiftedDate"],
} as const;
/** Shift a supplied research contact date by explicit signed UTC calendar days without claiming complete deidentification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactDate, suppliedShiftDays } = request;
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
      Number.isSafeInteger(suppliedShiftDays) &&
        suppliedShiftDays >= -Number.MAX_SAFE_INTEGER &&
        suppliedShiftDays <= Number.MAX_SAFE_INTEGER,
      "suppliedShiftDays",
    ),
      suppliedShiftDays);
    return (() => {
      const date = namedDate(contactDate, "contactDate");
      date.setUTCDate(date.getUTCDate() + suppliedShiftDays);
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.getUTCFullYear() >= 0 &&
          date.getUTCFullYear() <= 9999,
        "suppliedShiftDays",
      );
      return { shiftedDate: date.toISOString().slice(0, 10) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactDate: "2026-10-28", suppliedShiftDays: 4 },
  output: { shiftedDate: "2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const researchContactDateRedactionShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/research-contact-date-redaction-shift",
    title: "Research Contact Date Redaction Shift Tool",
    description:
      "Shift a supplied research contact date by explicit signed UTC calendar days without claiming complete deidentification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactDate: { type: "string", maxLength: 8192 },
        suppliedShiftDays: { type: "integer" },
      },
      required: ["contactDate", "suppliedShiftDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shiftedDate: { type: "string", maxLength: 8192 } },
      required: ["shiftedDate"],
    },
    ports: {
      inputs: [
        {
          id: "contactDate",
          label: "Contact Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedShiftDays",
          label: "Supplied Shift Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shiftedDate",
          label: "Shifted Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchContactDateRedactionShiftTool.execute;
export default researchContactDateRedactionShiftTool;
