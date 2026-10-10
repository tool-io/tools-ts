import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releaseDate: string;
  readonly recaptureDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releaseDate: { type: "string", maxLength: 8192 },
    recaptureDate: { type: "string", maxLength: 8192 },
  },
  required: ["releaseDate", "recaptureDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed date-only calendar days between supplied fish release and recapture records without growth or movement inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { releaseDate, recaptureDate } = request;
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
        (namedDate(recaptureDate, "recaptureDate").getTime() -
          namedDate(releaseDate, "releaseDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { releaseDate: "2026-10-28", recaptureDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const fishTagReleaseRecaptureDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-tag-release-recapture-date-gap",
    title: "Fish Tag Release Recapture Date Gap Tool",
    description:
      "Calculate signed date-only calendar days between supplied fish release and recapture records without growth or movement inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        releaseDate: { type: "string", maxLength: 8192 },
        recaptureDate: { type: "string", maxLength: 8192 },
      },
      required: ["releaseDate", "recaptureDate"],
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
          id: "releaseDate",
          label: "Release Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recaptureDate",
          label: "Recapture Date",
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
export const run = fishTagReleaseRecaptureDateGapTool.execute;
export default fishTagReleaseRecaptureDateGapTool;
