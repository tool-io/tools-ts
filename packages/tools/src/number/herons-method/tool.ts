import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { value: 9, tolerance: 1e-12, maxIterations: 100 },
  output: { approximation: 3, iterations: 7 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "number/herons-method",
  title: "Heron's Square Root Method",
  description:
    "Approximate the nonnegative square root with Heron's iteration and stop when successive estimates meet a relative tolerance.",
  inputs: [
    { id: "value", kind: "number", label: "value", minimum: 0 },
    { id: "tolerance", kind: "number", label: "tolerance", minimum: 1e-15 },
    {
      id: "maxIterations",
      kind: "integer",
      label: "max Iterations",
      minimum: 1,
      maximum: 1000,
    },
  ],
  outputs: [
    { id: "approximation", kind: "number", label: "approximation" },
    { id: "iterations", kind: "integer", label: "iterations" },
  ],
  calculate: (input) => {
    const value = input.value as number;
    if (value === 0) return { approximation: 0, iterations: 0 };
    let estimate = value >= 1 ? value : 1;
    for (
      let iterations = 1;
      iterations <= (input.maxIterations as number);
      iterations += 1
    ) {
      const next = (estimate + value / estimate) / 2;
      if (!Number.isFinite(next)) simpleError("value", "Iteration overflowed.");
      if (
        Math.abs(next - estimate) <=
        (input.tolerance as number) * Math.max(1, Math.abs(next))
      )
        return { approximation: next, iterations };
      estimate = next;
    }
    return {
      approximation: estimate,
      iterations: input.maxIterations as number,
    };
  },
});
export type HeronsMethodInput = Readonly<typeof example.input>;
export type HeronsMethodOutput = Readonly<typeof example.output>;
export const heronsMethodTool = tool;
export const runHeronsMethod = tool.execute;
export default tool;
