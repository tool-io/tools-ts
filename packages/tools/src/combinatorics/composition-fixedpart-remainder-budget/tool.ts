import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly total: number;
  readonly fixedParts: readonly number[];
  readonly slots: number;
  readonly allowZero: boolean;
};
export type Output = {
  readonly remaining: number;
  readonly feasible: boolean;
  readonly minimumNeeded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer", minimum: 0 },
    fixedParts: { type: "array", maxItems: 256, items: { type: "integer" } },
    slots: { type: "integer", minimum: 0 },
    allowZero: { type: "boolean" },
  },
  required: ["total", "fixedParts", "slots", "allowZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "integer" },
    feasible: { type: "boolean" },
    minimumNeeded: { type: "integer" },
  },
  required: ["remaining", "feasible", "minimumNeeded"],
} as const;
/** Compute composition fixedpart remainder budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { total, fixedParts, slots, allowZero } = input;
  const compute = (): Output => {
    integer(total);
    integer(slots);
    domain(fixedParts.every((x) => x >= (allowZero ? 0 : 1)));
    const remaining = total - fixedParts.reduce((a, b) => a + b, 0),
      minimumNeeded = allowZero ? 0 : slots;
    return {
      remaining,
      feasible: remaining >= minimumNeeded && (slots > 0 || remaining === 0),
      minimumNeeded,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { total: 10, fixedParts: [3, 2], slots: 2, allowZero: false },
  output: { remaining: 5, feasible: true, minimumNeeded: 2 },
} satisfies ToolExample<Input, Output>;
export const compositionFixedpartRemainderBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/composition-fixedpart-remainder-budget",
  title: "Composition Fixedpart Remainder Budget Tool",
  description:
    "Compute composition fixedpart remainder budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "total",
        label: "Total",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "fixedParts",
        label: "Fixed Parts",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "slots",
        label: "Slots",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "allowZero",
        label: "Allow Zero",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
      { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      {
        id: "minimumNeeded",
        label: "Minimum Needed",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = compositionFixedpartRemainderBudgetTool.execute;
export default compositionFixedpartRemainderBudgetTool;
