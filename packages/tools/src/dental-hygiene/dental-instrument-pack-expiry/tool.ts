import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDate: string;
  readonly plannedUseDate: string;
};
export type Output = {
  readonly expiredByDate: boolean;
  readonly remainingDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDate: { type: "string", maxLength: 8192 },
    plannedUseDate: { type: "string", maxLength: 8192 },
  },
  required: ["expiryDate", "plannedUseDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiredByDate: { type: "boolean" },
    remainingDays: { type: "integer" },
  },
  required: ["expiredByDate", "remainingDays"],
} as const;
/** Compare an instrument pack’s explicit inclusive expiry date with a planned date without establishing sterility or suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDate, plannedUseDate } = request;
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
    const remainingDays =
      (namedDate(expiryDate, "expiryDate").getTime() -
        namedDate(plannedUseDate, "plannedUseDate").getTime()) /
      86400000;
    return { expiredByDate: remainingDays < 0, remainingDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expiryDate: "2026-12-01", plannedUseDate: "2026-11-01" },
  output: { expiredByDate: false, remainingDays: 30 },
} satisfies ToolExample<Input, Output>;
export const dentalInstrumentPackExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/dental-instrument-pack-expiry",
    title: "Dental Instrument Pack Expiry",
    description:
      "Compare an instrument pack’s explicit inclusive expiry date with a planned date without establishing sterility or suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDate: { type: "string", maxLength: 8192 },
        plannedUseDate: { type: "string", maxLength: 8192 },
      },
      required: ["expiryDate", "plannedUseDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiredByDate: { type: "boolean" },
        remainingDays: { type: "integer" },
      },
      required: ["expiredByDate", "remainingDays"],
    },
    ports: {
      inputs: [
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "plannedUseDate",
          label: "Planned Use Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "expiredByDate",
          label: "Expired By Date",
          valueType: { type: "boolean" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentalInstrumentPackExpiryTool.execute;
export default dentalInstrumentPackExpiryTool;
