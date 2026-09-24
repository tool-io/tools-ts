import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly day: number;
  readonly period: number;
  readonly origin: number;
};
export type Output = { readonly cycle: number; readonly phase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    day: { type: "integer" },
    period: { type: "integer", minimum: 1 },
    origin: { type: "integer" },
  },
  required: ["day", "period", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cycle: { type: "integer" }, phase: { type: "integer" } },
  required: ["cycle", "phase"],
} as const;
/** Index a caller-defined fictional day cycle exactly, including days before its origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { day, period, origin } = request;
  const compute = (): Output => {
    H.integer(period, 1);
    const d = BigInt(day) - BigInt(origin),
      p = BigInt(period),
      r = ((d % p) + p) % p;
    return { cycle: Number((d - r) / p), phase: Number(r) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { day: 17, period: 7, origin: 3 },
  output: { cycle: 2, phase: 0 },
} satisfies ToolExample<Input, Output>;
export const fictionalCalendarCyclePhaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/fictional-calendar-cycle-phase-token",
    title: "Fictional Calendar Cycle Phase Token Tool",
    description:
      "Index a caller-defined fictional day cycle exactly, including days before its origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        day: { type: "integer" },
        period: { type: "integer", minimum: 1 },
        origin: { type: "integer" },
      },
      required: ["day", "period", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cycle: { type: "integer" }, phase: { type: "integer" } },
      required: ["cycle", "phase"],
    },
    ports: {
      inputs: [
        {
          id: "day",
          label: "Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "cycle", label: "Cycle", valueType: { type: "integer" } },
        { id: "phase", label: "Phase", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = fictionalCalendarCyclePhaseTokenTool.execute;
export default fictionalCalendarCyclePhaseTokenTool;
