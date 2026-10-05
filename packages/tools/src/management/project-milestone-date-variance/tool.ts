import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedDate: string;
  readonly actualDate: string;
};
export type Output = { readonly varianceDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedDate: { type: "string", maxLength: 8192 },
    actualDate: { type: "string", maxLength: 8192 },
  },
  required: ["plannedDate", "actualDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { varianceDays: { type: "integer" } },
  required: ["varianceDays"],
} as const;
/** Measure actual-minus-planned milestone variance in Gregorian calendar days, positive for a late date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedDate, actualDate } = request;
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
      varianceDays:
        (namedDate(actualDate, "actualDate").getTime() -
          namedDate(plannedDate, "plannedDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedDate: "2026-10-10", actualDate: "2026-10-13" },
  output: { varianceDays: 3 },
} satisfies ToolExample<Input, Output>;
export const projectMilestoneDateVarianceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/project-milestone-date-variance",
    title: "Project Milestone Date Variance Tool",
    description:
      "Measure actual-minus-planned milestone variance in Gregorian calendar days, positive for a late date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedDate: { type: "string", maxLength: 8192 },
        actualDate: { type: "string", maxLength: 8192 },
      },
      required: ["plannedDate", "actualDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { varianceDays: { type: "integer" } },
      required: ["varianceDays"],
    },
    ports: {
      inputs: [
        {
          id: "plannedDate",
          label: "Planned Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "actualDate",
          label: "Actual Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "varianceDays",
          label: "Variance Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectMilestoneDateVarianceTool.execute;
export default projectMilestoneDateVarianceTool;
