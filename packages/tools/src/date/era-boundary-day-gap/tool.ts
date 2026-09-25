import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly date: string;
  readonly suppliedBoundaryDate: string;
};
export type Output = { readonly daysFromBoundary: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    suppliedBoundaryDate: { type: "string", maxLength: 8192 },
  },
  required: ["date", "suppliedBoundaryDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { daysFromBoundary: { type: "integer" } },
  required: ["daysFromBoundary"],
} as const;
/** Compare an ISO civil date with an explicit era-boundary date without selecting a historical era. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date, suppliedBoundaryDate } = request;
  const compute = (): Output => {
    return {
      daysFromBoundary:
        (H.dateOnly(date).getTime() -
          H.dateOnly(suppliedBoundaryDate).getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { date: "2024-01-03", suppliedBoundaryDate: "2024-01-01" },
  output: { daysFromBoundary: 2 },
} satisfies ToolExample<Input, Output>;
export const eraBoundaryDayGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "date/era-boundary-day-gap",
    title: "Era Boundary Day Gap Tool",
    description:
      "Compare an ISO civil date with an explicit era-boundary date without selecting a historical era.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: "string", maxLength: 8192 },
        suppliedBoundaryDate: { type: "string", maxLength: 8192 },
      },
      required: ["date", "suppliedBoundaryDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { daysFromBoundary: { type: "integer" } },
      required: ["daysFromBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "date",
          label: "Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBoundaryDate",
          label: "Supplied Boundary Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "daysFromBoundary",
          label: "Days From Boundary",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = eraBoundaryDayGapTool.execute;
export default eraBoundaryDayGapTool;
