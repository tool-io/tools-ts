import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventId: string;
  readonly dateText: string;
  readonly precision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventId: { type: "string", maxLength: 8192 },
    dateText: { type: "string", maxLength: 8192 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["exact-day", "month", "year", "circa", "range", "unknown"],
    },
  },
  required: ["eventId", "dateText", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach an explicit historical date-precision annotation without interpreting a calendar or inferring missing fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventId, dateText, precision } = request;
  const compute = (): Output => {
    H.domain(eventId.length > 0 && dateText.length > 0, "eventId");
    H.domain(
      ["exact-day", "month", "year", "circa", "range", "unknown"].includes(
        precision,
      ),
      "precision",
    );
    return {
      token:
        eventId +
        "; date=" +
        JSON.stringify(dateText) +
        "; precision=" +
        precision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventId: "E7", dateText: "1750", precision: "circa" },
  output: { token: 'E7; date="1750"; precision=circa' },
} satisfies ToolExample<Input, Output>;
export const historicalEventDatePrecisionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-event-date-precision-token",
    title: "Historical Event Date Precision Token Tool",
    description:
      "Attach an explicit historical date-precision annotation without interpreting a calendar or inferring missing fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventId: { type: "string", maxLength: 8192 },
        dateText: { type: "string", maxLength: 8192 },
        precision: {
          type: "string",
          maxLength: 8192,
          enum: ["exact-day", "month", "year", "circa", "range", "unknown"],
        },
      },
      required: ["eventId", "dateText", "precision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "eventId",
          label: "Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalEventDatePrecisionTokenTool.execute;
export default historicalEventDatePrecisionTokenTool;
