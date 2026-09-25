import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownDurations: readonly number[];
  readonly totalCycle: number;
  readonly unobservedPhaseCount: number;
};
export type Output = {
  readonly unassignedDuration: number;
  readonly equalShareIfAssumed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownDurations: { type: "array", maxItems: 256, items: { type: "number" } },
    totalCycle: { type: "number", minimum: 0 },
    unobservedPhaseCount: { type: "integer", minimum: 0 },
  },
  required: ["knownDurations", "totalCycle", "unobservedPhaseCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unassignedDuration: { type: "number" },
    equalShareIfAssumed: { type: "number" },
  },
  required: ["unassignedDuration", "equalShareIfAssumed"],
} as const;
/** Signed phase-duration budget; equal allocation is explicitly conditional, not a biological estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownDurations, totalCycle, unobservedPhaseCount } = request;
  const compute = (): Output => {
    H.domain(totalCycle >= 0 && knownDurations.every((x) => x >= 0));
    H.integer(unobservedPhaseCount, 0);
    return {
      unassignedDuration:
        totalCycle - knownDurations.reduce((a, b) => a + b, 0),
      equalShareIfAssumed:
        unobservedPhaseCount > 0
          ? (totalCycle - knownDurations.reduce((a, b) => a + b, 0)) /
            unobservedPhaseCount
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { knownDurations: [2, 3], totalCycle: 10, unobservedPhaseCount: 2 },
  output: { unassignedDuration: 5, equalShareIfAssumed: 2.5 },
} satisfies ToolExample<Input, Output>;
export const cellCycleMissingPhaseBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-cycle-missing-phase-budget",
    title: "Cell Cycle Missing Phase Budget Tool",
    description:
      "Signed phase-duration budget; equal allocation is explicitly conditional, not a biological estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        totalCycle: { type: "number", minimum: 0 },
        unobservedPhaseCount: { type: "integer", minimum: 0 },
      },
      required: ["knownDurations", "totalCycle", "unobservedPhaseCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unassignedDuration: { type: "number" },
        equalShareIfAssumed: { type: "number" },
      },
      required: ["unassignedDuration", "equalShareIfAssumed"],
    },
    ports: {
      inputs: [
        {
          id: "knownDurations",
          label: "Known Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "totalCycle",
          label: "Total Cycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unobservedPhaseCount",
          label: "Unobserved Phase Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unassignedDuration",
          label: "Unassigned Duration",
          valueType: { type: "number" },
        },
        {
          id: "equalShareIfAssumed",
          label: "Equal Share If Assumed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellCycleMissingPhaseBudgetTool.execute;
export default cellCycleMissingPhaseBudgetTool;
