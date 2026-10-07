import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDate: string;
  readonly offsetDays: number;
};
export type Output = { readonly followupDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDate: { type: "string", maxLength: 8192 },
    offsetDays: { type: "integer" },
  },
  required: ["referenceDate", "offsetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { followupDate: { type: "string", maxLength: 8192 } },
  required: ["followupDate"],
} as const;
/** Add a caller-supplied calendar-day offset to an explicit care-plan reference date without choosing a follow-up interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDate, offsetDays } = request;
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
      Number.isSafeInteger(offsetDays) &&
        offsetDays >= -Number.MAX_SAFE_INTEGER &&
        offsetDays <= Number.MAX_SAFE_INTEGER,
      "offsetDays",
    ),
      offsetDays);
    return {
      followupDate: (() => {
        const d = namedDate(referenceDate, "referenceDate");
        d.setUTCDate(d.getUTCDate() + offsetDays);
        H.domain(
          Number.isFinite(d.getTime()) &&
            d.getUTCFullYear() >= 0 &&
            d.getUTCFullYear() <= 9999,
          "offsetDays",
        );
        return d.toISOString().slice(0, 10);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDate: "2026-10-28", offsetDays: 4 },
  output: { followupDate: "2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const pharmacyCarePlanFollowupDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/pharmacy-care-plan-follow-up-date",
    title: "Pharmacy Care Plan Follow Up Date",
    description:
      "Add a caller-supplied calendar-day offset to an explicit care-plan reference date without choosing a follow-up interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDate: { type: "string", maxLength: 8192 },
        offsetDays: { type: "integer" },
      },
      required: ["referenceDate", "offsetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { followupDate: { type: "string", maxLength: 8192 } },
      required: ["followupDate"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "offsetDays",
          label: "Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "followupDate",
          label: "Followup Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyCarePlanFollowupDateTool.execute;
export default pharmacyCarePlanFollowupDateTool;
