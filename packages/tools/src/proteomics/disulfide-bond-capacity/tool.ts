import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly cysteineCount: number;
  readonly maxDisulfideBonds: number;
  readonly unpairedCysteines: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cysteineCount = [...s].filter((v) => v === "C").length,
    maxDisulfideBonds = Math.floor(cysteineCount / 2);
  return {
    cysteineCount,
    maxDisulfideBonds,
    unpairedCysteines: cysteineCount % 2,
  };
};
export const exampleInput = { sequence: "ACCC" } satisfies Input;
export const exampleOutput = {
  cysteineCount: 3,
  maxDisulfideBonds: 1,
  unpairedCysteines: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/disulfide-bond-capacity",
  title: "Disulfide Bond Capacity",
  description:
    "Compute the maximum number of intrachain disulfides from cysteine count.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "cysteineCount", label: "Cysteine count", kind: "number" },
    { id: "maxDisulfideBonds", label: "Max disulfide bonds", kind: "number" },
    { id: "unpairedCysteines", label: "Unpaired cysteines", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
