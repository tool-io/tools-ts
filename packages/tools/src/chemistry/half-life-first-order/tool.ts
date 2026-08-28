import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const halfLifeFirstOrderExample = {
  input: { rateConstantPerS: 0.01 },
} satisfies ToolExample<{
  readonly rateConstantPerS: number;
}>;

export const halfLifeFirstOrderTool = createSimpleTool({
  id: "chemistry/half-life-first-order",
  title: "First Order Half-Life",
  description:
    "Compute the half-life of a first order reaction as the natural logarithm of two divided by the rate constant.",
  inputs: [
    {
      id: "rateConstantPerS",
      label: "Rate constant k",
      kind: "number",
      unit: "1/s",
    },
  ],
  outputs: [
    { id: "halfLifeSeconds", label: "Half-life", kind: "number", unit: "s" },
  ],
  calculate: (input) => {
    const rateConstantPerS = input.rateConstantPerS as number;
    if (!(rateConstantPerS > 0))
      simpleError("rateConstantPerS", "Rate constant must be positive.");
    return { halfLifeSeconds: Math.LN2 / rateConstantPerS };
  },
});
export const runHalfLifeFirstOrder = halfLifeFirstOrderTool.execute;
export default halfLifeFirstOrderTool;
