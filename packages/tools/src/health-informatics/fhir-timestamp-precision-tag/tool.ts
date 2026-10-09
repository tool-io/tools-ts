import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly timestampText: string;
  readonly recordedPrecision: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timestampText: { type: "string", maxLength: 8192, minLength: 1 },
    recordedPrecision: {
      type: "string",
      maxLength: 8192,
      enum: ["year", "month", "day", "second", "fractional-second", "unknown"],
    },
  },
  required: ["timestampText", "recordedPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach an explicit precision tag to supplied FHIR-related timestamp text without parsing or certifying a FHIR dateTime value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { timestampText, recordedPrecision } = request;
  const compute = (): Output => {
    H.domain(timestampText.length > 0, "timestampText");
    H.domain(
      [
        "year",
        "month",
        "day",
        "second",
        "fractional-second",
        "unknown",
      ].includes(recordedPrecision),
      "recordedPrecision",
    );
    return { tag: JSON.stringify([timestampText, recordedPrecision]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { timestampText: "2026-11-01", recordedPrecision: "day" },
  output: { tag: '["2026-11-01","day"]' },
} satisfies ToolExample<Input, Output>;
export const fhirTimestampPrecisionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/fhir-timestamp-precision-tag",
    title: "FHIR Timestamp Precision Tag",
    description:
      "Attach an explicit precision tag to supplied FHIR-related timestamp text without parsing or certifying a FHIR dateTime value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timestampText: { type: "string", maxLength: 8192, minLength: 1 },
        recordedPrecision: {
          type: "string",
          maxLength: 8192,
          enum: [
            "year",
            "month",
            "day",
            "second",
            "fractional-second",
            "unknown",
          ],
        },
      },
      required: ["timestampText", "recordedPrecision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "timestampText",
          label: "Timestamp Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedPrecision",
          label: "Recorded Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fhirTimestampPrecisionTagTool.execute;
export default fhirTimestampPrecisionTagTool;
