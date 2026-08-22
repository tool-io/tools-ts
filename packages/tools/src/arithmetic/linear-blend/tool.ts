import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const linearBlendTool = createSimpleTool({
  id: "arithmetic/linear-blend",
  title: "Linear Blend Calculator",
  description:
    "Blend two numbers linearly with an interpolation factor t, where zero returns a and one returns b.",
  inputs: [
    {
      description: "Value returned when t is zero.",
      id: "a",
      label: "Start",
      kind: "number",
    },
    {
      description: "Value returned when t is one.",
      id: "b",
      label: "End",
      kind: "number",
    },
    {
      description:
        "Interpolation factor; values outside zero to one extrapolate.",
      id: "t",
      label: "Factor",
      kind: "number",
    },
  ],
  outputs: [{ id: "blended", label: "Blended value", kind: "number" }],
  calculate: (input) => {
    const a = input.a as number;
    return { blended: a + ((input.b as number) - a) * (input.t as number) };
  },
});
export const runLinearBlend = linearBlendTool.execute;
export default linearBlendTool;

export type LinearBlendInput = {
  readonly a: number;
  readonly b: number;
  readonly t: number;
};

export type LinearBlendOutput = {
  readonly blended: number;
};

export const linearBlendExample = {
  input: {
    a: 1,
    b: 1,
    t: 1,
  },
  output: {
    blended: 1,
  },
} satisfies ToolExample<LinearBlendInput, LinearBlendOutput>;
