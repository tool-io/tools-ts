import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly propertyCode: string;
  readonly localDate: string;
  readonly localTime: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propertyCode: { type: "string", maxLength: 8192 },
    localDate: { type: "string", maxLength: 8192 },
    localTime: { type: "string", maxLength: 8192 },
  },
  required: ["propertyCode", "localDate", "localTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a property-local check-in date and time without converting time zones or assuming an offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propertyCode, localDate, localTime } = request;
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
    H.domain(propertyCode.length > 0, "propertyCode");
    namedDate(localDate, "localDate");
    H.domain(
      /^(?:[01]\d|2[0-3]):[0-5]\d(?![\s\S])/.test(localTime),
      "localTime",
    );
    return {
      label:
        propertyCode + " check-in " + localDate + " " + localTime + " local",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { propertyCode: "H12", localDate: "2026-11-01", localTime: "15:00" },
  output: { label: "H12 check-in 2026-11-01 15:00 local" },
} satisfies ToolExample<Input, Output>;
export const hotelCheckInLocalDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/hotel-check-in-local-date-label",
    title: "Hotel Check In Local Date Label Tool",
    description:
      "Label a property-local check-in date and time without converting time zones or assuming an offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propertyCode: { type: "string", maxLength: 8192 },
        localDate: { type: "string", maxLength: 8192 },
        localTime: { type: "string", maxLength: 8192 },
      },
      required: ["propertyCode", "localDate", "localTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "propertyCode",
          label: "Property Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "localDate",
          label: "Local Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "localTime",
          label: "Local Time",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hotelCheckInLocalDateLabelTool.execute;
export default hotelCheckInLocalDateLabelTool;
