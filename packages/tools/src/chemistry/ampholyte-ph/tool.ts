import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const AmpholytePhTool = createSimpleTool({
  id: "chemistry/ampholyte-ph",
  title: "Ampholyte pH Calculator",
  description: "Compute ampholyte pH = 0.5*(pKa1+pKa2).",
  inputs: [
    { id: "pka1", label: "pKa1", kind: "number" },
    { id: "pka2", label: "pKa2", kind: "number" },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    return { ph: ((input.pka1 as number) + (input.pka2 as number)) / 2 };
  },
});
export default AmpholytePhTool;
export const runAmpholytePh = AmpholytePhTool.execute;

export type AmpholytePhInput = {
  readonly pka1: number;
  readonly pka2: number;
};

export type AmpholytePhOutput = {
  readonly ph: number;
};

export const ampholytePhExample = {
  input: {
    pka1: 1,
    pka2: 1,
  },
  output: {
    ph: 1,
  },
} satisfies ToolExample<AmpholytePhInput, AmpholytePhOutput>;
