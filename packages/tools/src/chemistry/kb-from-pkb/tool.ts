import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type KbFromPkbInput = {
  readonly pKb: number;
};

export type KbFromPkbOutput = {
  readonly kb: number;
};

export const kbFromPkbExample = {
  input: { pKb: 5 },
  output: { kb: 0.00001 },
} satisfies ToolExample<KbFromPkbInput, KbFromPkbOutput>;

export const kbFromPkbTool = createSimpleTool({
  id: "chemistry/kb-from-pkb",
  title: "Kb From pKb",
  description: "Convert a pKb value to the base dissociation constant Kb.",
  inputs: [{ id: "pKb", label: "pKb", kind: "number" }],
  outputs: [{ id: "kb", label: "Kb", kind: "number" }],
  calculate: (input) => {
    const pKb = input.pKb as number;
    return { kb: Math.pow(10, -pKb) };
  },
});
export const runKbFromPkb = kbFromPkbTool.execute;
export default kbFromPkbTool;
