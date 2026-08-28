import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type KaFromPkaInput = {
  readonly pKa: number;
};

export type KaFromPkaOutput = {
  readonly ka: number;
};

export const kaFromPkaExample = {
  input: { pKa: 4 },
  output: { ka: 0.0001 },
} satisfies ToolExample<KaFromPkaInput, KaFromPkaOutput>;

export const kaFromPkaTool = createSimpleTool({
  id: "chemistry/ka-from-pka",
  title: "Ka From pKa",
  description: "Convert a pKa value to the acid dissociation constant Ka.",
  inputs: [{ id: "pKa", label: "pKa", kind: "number" }],
  outputs: [{ id: "ka", label: "Ka", kind: "number" }],
  calculate: (input) => {
    const pKa = input.pKa as number;
    return { ka: Math.pow(10, -pKa) };
  },
});
export const runKaFromPka = kaFromPkaTool.execute;
export default kaFromPkaTool;
