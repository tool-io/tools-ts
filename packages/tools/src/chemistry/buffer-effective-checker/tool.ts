import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const bufferEffectiveCheckerTool = createSimpleTool({
  id: "chemistry/buffer-effective-checker",
  title: "Buffer Effective Checker",
  description:
    "Check whether a pH lies within the effective buffering range of pKa ± 1.",
  inputs: [
    {
      description: "Current pH of the solution.",
      id: "ph",
      label: "pH",
      kind: "number",
    },
    {
      description: "pKa of the buffering weak acid.",
      id: "pka",
      label: "pKa",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Whether the pH is within one unit of the pKa.",
      id: "effective",
      label: "Effective",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const ph = input.ph as number;
    const pka = input.pka as number;
    return { effective: Math.abs(ph - pka) <= 1 };
  },
});
export const runBufferEffectiveChecker = bufferEffectiveCheckerTool.execute;
export default bufferEffectiveCheckerTool;

export type BufferEffectiveCheckerInput = {
  readonly ph: number;
  readonly pka: number;
};

export type BufferEffectiveCheckerOutput = {
  readonly effective: boolean;
};

export const bufferEffectiveCheckerExample = {
  input: {
    ph: 1,
    pka: 1,
  },
  output: {
    effective: true,
  },
} satisfies ToolExample<
  BufferEffectiveCheckerInput,
  BufferEffectiveCheckerOutput
>;
