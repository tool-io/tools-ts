import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { chineseRemainder } from "../milestone-algorithms.js";

export const example = {
  input: {
    residues: [2, 3, 2],
    moduli: [3, 5, 7],
  },
  output: {
    solution: "23",
    period: "105",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tool = createSimpleTool({
  id: "number/chinese-remainder",
  title: "Chinese Remainder Theorem Solver",
  description:
    "Solve a list of integer congruences, including non-coprime moduli when consistent; return the smallest nonnegative solution and its period as exact decimal strings.",
  inputs: [
    { id: "residues", kind: "numberList", label: "residues" },
    { id: "moduli", kind: "numberList", label: "moduli" },
  ],
  outputs: [
    { id: "solution", kind: "string", label: "solution" },
    { id: "period", kind: "string", label: "period" },
  ],
  calculate: (input) =>
    chineseRemainder(input.residues as number[], input.moduli as number[]),
});
export type ChineseRemainderInput = Readonly<typeof example.input>;
export type ChineseRemainderOutput = Readonly<typeof example.output>;
export const chineseRemainderTool = tool;
export const runChineseRemainder = tool.execute;
export default tool;
