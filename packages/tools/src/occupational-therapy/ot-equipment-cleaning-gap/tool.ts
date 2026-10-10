import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastCleaningDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly signedDaysSinceCleaning: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastCleaningDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["lastCleaningDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDaysSinceCleaning: { type: "number" } },
  required: ["signedDaysSinceCleaning"],
} as const;
/** Count signed calendar days since an explicit equipment cleaning record without determining cleanliness or required intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastCleaningDate, asOfDate } = request;
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
      signedDaysSinceCleaning:
        (namedDate(asOfDate, "asOfDate").getTime() -
          namedDate(lastCleaningDate, "lastCleaningDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastCleaningDate: "2026-10-30", asOfDate: "2026-11-01" },
  output: { signedDaysSinceCleaning: 2 },
} satisfies ToolExample<Input, Output>;
export const othequipmentCleaningGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/ot-equipment-cleaning-gap",
    title: "OT Equipment Cleaning Gap",
    description:
      "Count signed calendar days since an explicit equipment cleaning record without determining cleanliness or required intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastCleaningDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["lastCleaningDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDaysSinceCleaning: { type: "number" } },
      required: ["signedDaysSinceCleaning"],
    },
    ports: {
      inputs: [
        {
          id: "lastCleaningDate",
          label: "Last Cleaning Date",
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
        {
          id: "signedDaysSinceCleaning",
          label: "Signed Days Since Cleaning",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = othequipmentCleaningGapTool.execute;
export default othequipmentCleaningGapTool;
