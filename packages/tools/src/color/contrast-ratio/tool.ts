import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ContrastRatioTool = createSimpleTool({
  id: "color/contrast-ratio",
  title: "Contrast Ratio Calculator",
  description: "Compute WCAG contrast ratio between two luminance values.",
  inputs: [
    {
      id: "luminance1",
      label: "Luminance 1",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "luminance2",
      label: "Luminance 2",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [{ id: "contrastRatio", label: "Contrast ratio", kind: "number" }],
  calculate: (input) => {
    const l1 = input.luminance1 as number;
    const l2 = input.luminance2 as number;
    return {
      contrastRatio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
    };
  },
});
export default ContrastRatioTool;
export const runContrastRatio = ContrastRatioTool.execute;

export type ContrastRatioInput = {
  readonly luminance1: number;
  readonly luminance2: number;
};

export type ContrastRatioOutput = {
  readonly contrastRatio: number;
};

export const contrastRatioExample = {
  input: {
    luminance1: 1,
    luminance2: 1,
  },
  output: {
    contrastRatio: 1,
  },
} satisfies ToolExample<ContrastRatioInput, ContrastRatioOutput>;
