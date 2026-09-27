import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCycle: number;
  readonly currentCycle: number;
  readonly suppliedInterval: number;
};
export type Output = { readonly elapsed: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCycle: { type: "number" },
    currentCycle: { type: "number" },
    suppliedInterval: { type: "number", minimum: 0 },
  },
  required: ["previousCycle", "currentCycle", "suppliedInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, remaining: { type: "number" } },
  required: ["elapsed", "remaining"],
} as const;
/** Audit explicit sanitation record clocks without selecting cleaning intervals or certifying efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCycle, currentCycle, suppliedInterval } = request;
  const compute = (): Output => {
    H.domain(suppliedInterval >= 0);
    return {
      elapsed: currentCycle - previousCycle,
      remaining: suppliedInterval - currentCycle + previousCycle,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCycle: 10, currentCycle: 25, suppliedInterval: 20 },
  output: { elapsed: 15, remaining: 5 },
} satisfies ToolExample<Input, Output>;
export const sanitationRecordCycleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/sanitation-record-cycle-gap",
    title: "Sanitation Record Cycle Gap Tool",
    description:
      "Audit explicit sanitation record clocks without selecting cleaning intervals or certifying efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCycle: { type: "number" },
        currentCycle: { type: "number" },
        suppliedInterval: { type: "number", minimum: 0 },
      },
      required: ["previousCycle", "currentCycle", "suppliedInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["elapsed", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "previousCycle",
          label: "Previous Cycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentCycle",
          label: "Current Cycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedInterval",
          label: "Supplied Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sanitationRecordCycleGapTool.execute;
export default sanitationRecordCycleGapTool;
