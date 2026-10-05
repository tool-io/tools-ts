import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly readyDate: string; readonly holdDays: number };
export type Output = { readonly expiryDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readyDate: { type: "string", maxLength: 8192 },
    holdDays: { type: "integer", minimum: 0, maximum: 36500 },
  },
  required: ["readyDate", "holdDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expiryDate: { type: "string", maxLength: 8192 } },
  required: ["expiryDate"],
} as const;
/** Add an explicit calendar-day hold interval to a ready date; the ready day is offset zero and no opening-day calendar is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { readyDate, holdDays } = request;
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
      Number.isSafeInteger(holdDays) && holdDays >= 0 && holdDays <= 36500,
      "holdDays",
    ),
      holdDays);
    const d = namedDate(readyDate, "readyDate");
    d.setUTCDate(d.getUTCDate() + holdDays);
    H.domain(d.getUTCFullYear() <= 9999, "");
    return { expiryDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { readyDate: "2026-10-28", holdDays: 7 },
  output: { expiryDate: "2026-11-04" },
} satisfies ToolExample<Input, Output>;
export const libraryHoldExpiryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/library-hold-expiry-offset",
    title: "Library Hold Expiry Offset Tool",
    description:
      "Add an explicit calendar-day hold interval to a ready date; the ready day is offset zero and no opening-day calendar is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readyDate: { type: "string", maxLength: 8192 },
        holdDays: { type: "integer", minimum: 0, maximum: 36500 },
      },
      required: ["readyDate", "holdDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expiryDate: { type: "string", maxLength: 8192 } },
      required: ["expiryDate"],
    },
    ports: {
      inputs: [
        {
          id: "readyDate",
          label: "Ready Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "holdDays",
          label: "Hold Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expiryDate",
          label: "Expiry Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = libraryHoldExpiryOffsetTool.execute;
export default libraryHoldExpiryOffsetTool;
