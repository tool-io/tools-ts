import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NthRootInput = {
  readonly degree: number;
  readonly value: number;
};

export type NthRootOutput = {
  readonly root: number;
};

export const nthRootExample = {
  input: {
    degree: 2,
    value: 16,
  },
} satisfies ToolExample<NthRootInput>;

export const nthRootTool = createSimpleTool({
  id: "arithmetic/nth-root",
  title: "Nth Root Calculator",
  description:
    "Calculate square roots, cube roots, and other principal real nth roots.",
  inputs: [
    {
      description: "The number whose principal real root will be calculated.",
      id: "value",
      label: "Number",
      kind: "number",
    },
    {
      description:
        "An integer of 2 or greater; use 2 for a square root or 3 for a cube root.",
      id: "degree",
      label: "Root degree",
      kind: "integer",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description: "The principal real nth root.",
      id: "root",
      label: "Root",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const degree = input.degree as number;
    if (value < 0 && degree % 2 === 0)
      simpleError(
        "value",
        "A negative value has no real root for an even degree.",
      );

    const magnitude = Math.abs(value) ** (1 / degree);
    const root = value < 0 ? -magnitude : magnitude;
    if (!Number.isFinite(root))
      simpleError("value", "The inputs do not produce a finite real root.");
    return { root };
  },
});

export const runNthRoot = nthRootTool.execute;
export default nthRootTool;
