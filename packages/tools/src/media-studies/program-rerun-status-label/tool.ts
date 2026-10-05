import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly programId: string;
  readonly originalAirDate: string;
  readonly currentAirDate: string;
};
export type Output = { readonly rerun: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    programId: { type: "string", maxLength: 8192 },
    originalAirDate: { type: "string", maxLength: 8192 },
    currentAirDate: { type: "string", maxLength: 8192 },
  },
  required: ["programId", "originalAirDate", "currentAirDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rerun: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["rerun", "label"],
} as const;
/** Label an airing as later than its recorded original date; multiple airings on the original date remain original-date airings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { programId, originalAirDate, currentAirDate } = request;
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
    H.domain(programId.length > 0, "programId");
    const a = namedDate(originalAirDate, "originalAirDate").getTime(),
      b = namedDate(currentAirDate, "currentAirDate").getTime();
    H.domain(b >= a, "");
    const rerun = b > a;
    return {
      rerun,
      label:
        programId +
        " [" +
        (rerun ? "later airing" : "original-date airing") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    programId: "P12",
    originalAirDate: "2025-01-01",
    currentAirDate: "2026-01-01",
  },
  output: { rerun: true, label: "P12 [later airing]" },
} satisfies ToolExample<Input, Output>;
export const programRerunStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/program-rerun-status-label",
    title: "Program Rerun Status Label Tool",
    description:
      "Label an airing as later than its recorded original date; multiple airings on the original date remain original-date airings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        programId: { type: "string", maxLength: 8192 },
        originalAirDate: { type: "string", maxLength: 8192 },
        currentAirDate: { type: "string", maxLength: 8192 },
      },
      required: ["programId", "originalAirDate", "currentAirDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rerun: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["rerun", "label"],
    },
    ports: {
      inputs: [
        {
          id: "programId",
          label: "Program Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalAirDate",
          label: "Original Air Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentAirDate",
          label: "Current Air Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "rerun", label: "Rerun", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = programRerunStatusLabelTool.execute;
export default programRerunStatusLabelTool;
