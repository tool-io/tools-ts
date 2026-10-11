import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDate: string;
  readonly suppliedDays: number;
};
export type Output = { readonly inclusiveEndDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDate: { type: "string", maxLength: 8192 },
    suppliedDays: { type: "integer", minimum: 1 },
  },
  required: ["startDate", "suppliedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inclusiveEndDate: { type: "string", maxLength: 8192 } },
  required: ["inclusiveEndDate"],
} as const;
/** Add an explicit positive days-supply interval to a start date using inclusive calendar-day coverage without inferring medication use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDate, suppliedDays } = request;
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
      Number.isSafeInteger(suppliedDays) &&
        suppliedDays >= 1 &&
        suppliedDays <= Number.MAX_SAFE_INTEGER,
      "suppliedDays",
    ),
      suppliedDays);
    return {
      inclusiveEndDate: (() => {
        const d = namedDate(startDate, "startDate");
        d.setUTCDate(d.getUTCDate() + suppliedDays - 1);
        H.domain(
          Number.isFinite(d.getTime()) &&
            d.getUTCFullYear() >= 0 &&
            d.getUTCFullYear() <= 9999,
          "suppliedDays",
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
  input: { startDate: "2026-10-28", suppliedDays: 5 },
  output: { inclusiveEndDate: "2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const prescriptionCoverageEndDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/prescription-coverage-end-date",
    title: "Prescription Coverage End Date",
    description:
      "Add an explicit positive days-supply interval to a start date using inclusive calendar-day coverage without inferring medication use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDate: { type: "string", maxLength: 8192 },
        suppliedDays: { type: "integer", minimum: 1 },
      },
      required: ["startDate", "suppliedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inclusiveEndDate: { type: "string", maxLength: 8192 } },
      required: ["inclusiveEndDate"],
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
          id: "suppliedDays",
          label: "Supplied Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "inclusiveEndDate",
          label: "Inclusive End Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = prescriptionCoverageEndDateTool.execute;
export default prescriptionCoverageEndDateTool;
