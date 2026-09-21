import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCalving: string;
  readonly nextCalving: string;
  readonly targetDays: number;
};
export type Output = {
  readonly intervalDays: number;
  readonly targetGapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCalving: { type: "string", maxLength: 8192 },
    nextCalving: { type: "string", maxLength: 8192 },
    targetDays: { type: "integer", minimum: 0 },
  },
  required: ["firstCalving", "nextCalving", "targetDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intervalDays: { type: "integer" },
    targetGapDays: { type: "integer" },
  },
  required: ["intervalDays", "targetGapDays"],
} as const;
/** Calculate herd calving interval day gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCalving, nextCalving, targetDays } = request;
  const compute = (): Output => {
    H.integer(targetDays, 0);
    H.domain(
      H.dateOnly(nextCalving).getTime() >= H.dateOnly(firstCalving).getTime(),
    );
    return {
      intervalDays:
        (H.dateOnly(nextCalving).getTime() -
          H.dateOnly(firstCalving).getTime()) /
        86400000,
      targetGapDays:
        (H.dateOnly(nextCalving).getTime() -
          H.dateOnly(firstCalving).getTime()) /
          86400000 -
        targetDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCalving: "2025-01-01",
    nextCalving: "2026-01-01",
    targetDays: 360,
  },
  output: { intervalDays: 365, targetGapDays: 5 },
} satisfies ToolExample<Input, Output>;
export const herdCalvingIntervalDayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/herd-calving-interval-day-gap",
    title: "Herd Calving Interval Day Gap Tool",
    description:
      "Calculate herd calving interval day gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCalving: { type: "string", maxLength: 8192 },
        nextCalving: { type: "string", maxLength: 8192 },
        targetDays: { type: "integer", minimum: 0 },
      },
      required: ["firstCalving", "nextCalving", "targetDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalDays: { type: "integer" },
        targetGapDays: { type: "integer" },
      },
      required: ["intervalDays", "targetGapDays"],
    },
    ports: {
      inputs: [
        {
          id: "firstCalving",
          label: "First Calving",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextCalving",
          label: "Next Calving",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetDays",
          label: "Target Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "intervalDays",
          label: "Interval Days",
          valueType: { type: "integer" },
        },
        {
          id: "targetGapDays",
          label: "Target Gap Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = herdCalvingIntervalDayGapTool.execute;
export default herdCalvingIntervalDayGapTool;
