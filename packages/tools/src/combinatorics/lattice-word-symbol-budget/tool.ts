import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly available: readonly number[];
  readonly used: readonly number[];
};
export type Output = {
  readonly remaining: readonly number[];
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "array", maxItems: 256, items: { type: "integer" } },
    used: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["available", "used"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "array", maxItems: 256, items: { type: "integer" } },
    feasible: { type: "boolean" },
  },
  required: ["remaining", "feasible"],
} as const;
/** Compute lattice word symbol budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { available, used } = input;
  const compute = (): Output => {
    sameLength(available, used);
    domain(available.every((x) => x >= 0) && used.every((x) => x >= 0));
    const remaining = available.map((x, i) => x - used[i]);
    return { remaining, feasible: remaining.every((x) => x >= 0) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { available: [3, 2], used: [2, 1] },
  output: { remaining: [1, 1], feasible: true },
} satisfies ToolExample<Input, Output>;
export const latticeWordSymbolBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/lattice-word-symbol-budget",
  title: "Lattice Word Symbol Budget Tool",
  description:
    "Compute lattice word symbol budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "available",
        label: "Available",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "used",
        label: "Used",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      {
        id: "remaining",
        label: "Remaining",
        valueType: { type: "list", items: { type: "integer" } },
      },
      { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
    ],
  },
});
export const run = latticeWordSymbolBudgetTool.execute;
export default latticeWordSymbolBudgetTool;
