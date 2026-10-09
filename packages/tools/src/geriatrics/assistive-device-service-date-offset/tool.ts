import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastServiceDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastServiceDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["lastServiceDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed date-only elapsed service days for an explicitly identified assistive-device record without selecting service intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastServiceDate, asOfDate } = request;
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
      signedCalendarDays:
        (namedDate(asOfDate, "asOfDate").getTime() -
          namedDate(lastServiceDate, "lastServiceDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lastServiceDate: "2026-10-28", asOfDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const assistiveDeviceServiceDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/assistive-device-service-date-offset",
    title: "Assistive Device Service Date Offset Tool",
    description:
      "Measure signed date-only elapsed service days for an explicitly identified assistive-device record without selecting service intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastServiceDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["lastServiceDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "integer" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "lastServiceDate",
          label: "Last Service Date",
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
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = assistiveDeviceServiceDateOffsetTool.execute;
export default assistiveDeviceServiceDateOffsetTool;
