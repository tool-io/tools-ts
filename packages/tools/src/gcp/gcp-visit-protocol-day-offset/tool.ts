import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly protocolReferenceDate: string;
  readonly visitDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    protocolReferenceDate: { type: "string", maxLength: 8192 },
    visitDate: { type: "string", maxLength: 8192 },
  },
  required: ["protocolReferenceDate", "visitDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Compute signed calendar-day offset from an explicit protocol reference date without choosing a protocol-day convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { protocolReferenceDate, visitDate } = request;
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
        (namedDate(visitDate, "visitDate").getTime() -
          namedDate(protocolReferenceDate, "protocolReferenceDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { protocolReferenceDate: "2026-10-28", visitDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const gcpVisitProtocolDayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-visit-protocol-day-offset",
    title: "GCP Visit Protocol Day Offset",
    description:
      "Compute signed calendar-day offset from an explicit protocol reference date without choosing a protocol-day convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        protocolReferenceDate: { type: "string", maxLength: 8192 },
        visitDate: { type: "string", maxLength: 8192 },
      },
      required: ["protocolReferenceDate", "visitDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "protocolReferenceDate",
          label: "Protocol Reference Date",
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
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpVisitProtocolDayOffsetTool.execute;
export default gcpVisitProtocolDayOffsetTool;
