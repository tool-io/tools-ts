import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const bufferRatioTool = createSimpleTool({
  id: "chemistry/buffer-ratio",
  title: "Buffer Ratio Calculator",
  description:
    "Apply the Henderson-Hasselbalch relation to compute the conjugate-base-to-acid ratio [A⁻]/[HA] = 10^(pH−pKa).",
  inputs: [
    {
      description: "Target pH of the buffer solution.",
      id: "ph",
      label: "pH",
      kind: "number",
    },
    {
      description: "pKa of the buffering acid.",
      id: "pka",
      label: "pKa",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Conjugate base to acid molar ratio.",
      id: "ratio",
      label: "[A⁻]/[HA] ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    return { ratio: 10 ** ((input.ph as number) - (input.pka as number)) };
  },
});
export const runBufferRatio = bufferRatioTool.execute;
export default bufferRatioTool;

export type BufferRatioInput = {
  readonly ph: number;
  readonly pka: number;
};

export type BufferRatioOutput = {
  readonly ratio: number;
};

export const bufferRatioExample = {
  input: {
    ph: 1,
    pka: 1,
  },
  output: {
    ratio: 1,
  },
} satisfies ToolExample<BufferRatioInput, BufferRatioOutput>;
