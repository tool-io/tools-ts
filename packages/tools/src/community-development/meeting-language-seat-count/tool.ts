import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly languageCodes: readonly string[];
  readonly requestedSeats: readonly number[];
};
export type Output = {
  readonly totalSeats: number;
  readonly distinctLanguages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedSeats: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["languageCodes", "requestedSeats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSeats: { type: "integer" },
    distinctLanguages: { type: "integer" },
  },
  required: ["totalSeats", "distinctLanguages"],
} as const;
/** Sum explicit language-channel seat requests with unique language codes without inferring attendee language needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { languageCodes, requestedSeats } = request;
  const compute = (): Output => {
    H.domain(languageCodes.length === requestedSeats.length, "requestedSeats");
    H.domain(
      new Set(languageCodes).size === languageCodes.length,
      "languageCodes",
    );
    requestedSeats.forEach(
      (v) => (
        H.domain(
          Number.isSafeInteger(v) && v >= 0 && v <= Number.MAX_SAFE_INTEGER,
          "requestedSeats",
        ),
        v
      ),
    );
    return {
      totalSeats: requestedSeats.reduce((a, b) => a + b, 0),
      distinctLanguages: languageCodes.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { languageCodes: ["en", "sw"], requestedSeats: [10, 8] },
  output: { totalSeats: 18, distinctLanguages: 2 },
} satisfies ToolExample<Input, Output>;
export const meetingLanguageSeatCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/meeting-language-seat-count",
    title: "Meeting Language Seat Count",
    description:
      "Sum explicit language-channel seat requests with unique language codes without inferring attendee language needs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedSeats: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["languageCodes", "requestedSeats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSeats: { type: "integer" },
        distinctLanguages: { type: "integer" },
      },
      required: ["totalSeats", "distinctLanguages"],
    },
    ports: {
      inputs: [
        {
          id: "languageCodes",
          label: "Language Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedSeats",
          label: "Requested Seats",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "totalSeats",
          label: "Total Seats",
          valueType: { type: "integer" },
        },
        {
          id: "distinctLanguages",
          label: "Distinct Languages",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = meetingLanguageSeatCountTool.execute;
export default meetingLanguageSeatCountTool;
