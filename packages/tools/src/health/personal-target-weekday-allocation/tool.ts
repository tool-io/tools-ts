import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weeklyTarget: number;
  readonly weights: readonly number[];
};
export type Output = { readonly allocations: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weeklyTarget: { type: "number", minimum: 0 },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["weeklyTarget", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["allocations"],
} as const;
/** Calculate personal target weekday allocation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weeklyTarget, weights } = request;
  const compute = (): Output => {
    H.domain(
      weeklyTarget >= 0 && weights.length === 7 && weights.every((x) => x >= 0),
    );
    const total = weights.reduce((a, b) => a + b, 0);
    H.positive(total);
    return { allocations: weights.map((x) => (weeklyTarget * x) / total) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weeklyTarget: 140, weights: [1, 1, 1, 1, 1, 1, 1] },
  output: { allocations: [20, 20, 20, 20, 20, 20, 20] },
} satisfies ToolExample<Input, Output>;
export const personalTargetWeekdayAllocationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/personal-target-weekday-allocation",
    title: "Personal Target Weekday Allocation Tool",
    description:
      "Calculate personal target weekday allocation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weeklyTarget: { type: "number", minimum: 0 },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["weeklyTarget", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["allocations"],
    },
    ports: {
      inputs: [
        {
          id: "weeklyTarget",
          label: "Weekly Target",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "allocations",
          label: "Allocations",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = personalTargetWeekdayAllocationTool.execute;
export default personalTargetWeekdayAllocationTool;
