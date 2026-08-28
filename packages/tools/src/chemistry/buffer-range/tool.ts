import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const bufferRangeTool = createSimpleTool({
  id: "chemistry/buffer-range",
  title: "Buffer Range Calculator",
  description:
    "Compute the effective buffering range as pKa ± 1 around a weak acid's pKa.",
  inputs: [
    {
      description: "pKa of the weak acid conjugate to the buffer base.",
      id: "pka",
      label: "pKa",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Lower bound of the effective buffer range.",
      id: "lower",
      label: "Lower bound",
      kind: "number",
    },
    {
      description: "Upper bound of the effective buffer range.",
      id: "upper",
      label: "Upper bound",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const pka = input.pka as number;
    return { lower: pka - 1, upper: pka + 1 };
  },
});
export const runBufferRange = bufferRangeTool.execute;
export default bufferRangeTool;

export type BufferRangeInput = {
  readonly pka: number;
};

export type BufferRangeOutput = {
  readonly lower: number;
  readonly upper: number;
};

export const bufferRangeExample = {
  input: {
    pka: 1,
  },
  output: {
    lower: 0,
    upper: 2,
  },
} satisfies ToolExample<BufferRangeInput, BufferRangeOutput>;
