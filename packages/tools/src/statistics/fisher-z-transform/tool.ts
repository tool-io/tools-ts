import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fisherZTransformExample = {
  input: { correlation: 0.5 },
} satisfies ToolExample<{ readonly correlation: number }>;

export const fisherZTransformTool = createSimpleTool({
  id: "statistics/fisher-z-transform",
  title: "Fisher Z-Transformation Calculator",
  description:
    "Transform a correlation coefficient with the Fisher inverse hyperbolic tangent.",
  inputs: [
    {
      id: "correlation",
      label: "Correlation",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
  ],
  outputs: [{ id: "z", label: "Fisher z", kind: "number" }],
  calculate: (input) => {
    const r = input.correlation as number;
    if (r <= -1 || r >= 1)
      simpleError(
        "correlation",
        "Correlation must be strictly between minus one and one.",
      );
    return { z: 0.5 * Math.log((1 + r) / (1 - r)) };
  },
});
export const runFisherZTransform = fisherZTransformTool.execute;
export default fisherZTransformTool;
