import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDate: string;
  readonly endDate: string;
  readonly inclusiveEnd: boolean;
};
export type Output = { readonly days: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDate: { type: "string", maxLength: 8192 },
    endDate: { type: "string", maxLength: 8192 },
    inclusiveEnd: { type: "boolean" },
  },
  required: ["startDate", "endDate", "inclusiveEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { days: { type: "integer" } },
  required: ["days"],
} as const;
/** Count supplied UTC civil dates with explicit end inclusion, without inferring ticket terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDate, endDate, inclusiveEnd } = request;
  const compute = (): Output => {
    H.domain(H.dateOnly(endDate) >= H.dateOnly(startDate));
    return {
      days:
        (H.dateOnly(endDate).getTime() - H.dateOnly(startDate).getTime()) /
          86400000 +
        (inclusiveEnd ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startDate: "2024-02-28", endDate: "2024-03-01", inclusiveEnd: true },
  output: { days: 3 },
} satisfies ToolExample<Input, Output>;
export const ticketValidDayCountTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "tourism/ticket-valid-day-count",
      title: "Ticket Valid Day Count Tool",
      description:
        "Count supplied UTC civil dates with explicit end inclusion, without inferring ticket terms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startDate: { type: "string", maxLength: 8192 },
          endDate: { type: "string", maxLength: 8192 },
          inclusiveEnd: { type: "boolean" },
        },
        required: ["startDate", "endDate", "inclusiveEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { days: { type: "integer" } },
        required: ["days"],
      },
      ports: {
        inputs: [
          {
            id: "startDate",
            label: "Start Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "endDate",
            label: "End Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "inclusiveEnd",
            label: "Inclusive End",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "days", label: "Days", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = ticketValidDayCountTool.execute;
export default ticketValidDayCountTool;
