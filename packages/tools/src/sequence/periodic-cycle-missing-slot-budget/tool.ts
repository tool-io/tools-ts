import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly period: number;
  readonly observed: number;
  readonly fullCycles: number;
  readonly partialSlots: number;
};
export type Output = { readonly expected: number; readonly missing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    period: { type: "integer", minimum: 1 },
    observed: { type: "integer", minimum: 0 },
    fullCycles: { type: "integer", minimum: 0 },
    partialSlots: { type: "integer", minimum: 0 },
  },
  required: ["period", "observed", "fullCycles", "partialSlots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expected: { type: "integer" }, missing: { type: "integer" } },
  required: ["expected", "missing"],
} as const;
/** Calculate periodic cycle missing slot budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { period, observed, fullCycles, partialSlots } = request;
  const compute = (): Output => {
    H.integer(period, 1);
    H.integer(fullCycles, 0);
    H.integer(partialSlots, 0, period - 1);
    H.integer(observed, 0);
    H.domain(
      Number.isSafeInteger(period * fullCycles + partialSlots) &&
        observed <= period * fullCycles + partialSlots,
    );
    return {
      expected: period * fullCycles + partialSlots,
      missing: period * fullCycles + partialSlots - observed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { period: 7, observed: 18, fullCycles: 3, partialSlots: 0 },
  output: { expected: 21, missing: 3 },
} satisfies ToolExample<Input, Output>;
export const periodicCycleMissingSlotBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/periodic-cycle-missing-slot-budget",
    title: "Periodic Cycle Missing Slot Budget Tool",
    description:
      "Calculate periodic cycle missing slot budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        period: { type: "integer", minimum: 1 },
        observed: { type: "integer", minimum: 0 },
        fullCycles: { type: "integer", minimum: 0 },
        partialSlots: { type: "integer", minimum: 0 },
      },
      required: ["period", "observed", "fullCycles", "partialSlots"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "integer" },
        missing: { type: "integer" },
      },
      required: ["expected", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fullCycles",
          label: "Full Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partialSlots",
          label: "Partial Slots",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "expected", label: "Expected", valueType: { type: "integer" } },
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = periodicCycleMissingSlotBudgetTool.execute;
export default periodicCycleMissingSlotBudgetTool;
