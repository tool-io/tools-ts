import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly startingMrr: number;
  readonly newMrr: number;
  readonly expansionMrr: number;
  readonly contractionMrr: number;
  readonly churnMrr: number;
}>;
export type Output = Readonly<{
  readonly endingMrr: number;
  readonly netNewMrr: number;
}>;
export const calculate = (input: Input): Output => {
  [
    input.startingMrr,
    input.newMrr,
    input.expansionMrr,
    input.contractionMrr,
    input.churnMrr,
  ].forEach((v) => nonnegative(v, "startingMrr"));
  if (input.contractionMrr + input.churnMrr > input.startingMrr)
    simpleError("churnMrr", "Losses exceed starting MRR.");
  const netNewMrr =
    input.newMrr + input.expansionMrr - input.contractionMrr - input.churnMrr;
  return { endingMrr: input.startingMrr + netNewMrr, netNewMrr };
};
export const exampleInput = {
  startingMrr: 100,
  newMrr: 20,
  expansionMrr: 10,
  contractionMrr: 5,
  churnMrr: 15,
} satisfies Input;
export const exampleOutput = { endingMrr: 110, netNewMrr: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/mrr-movement-bridge",
  title: "MRR Movement Bridge",
  description:
    "Reconcile starting MRR with new, expansion, contraction, and churn movements.",
  inputs: [
    { id: "startingMrr", label: "Starting mrr", kind: "number" },
    { id: "newMrr", label: "New mrr", kind: "number" },
    { id: "expansionMrr", label: "Expansion mrr", kind: "number" },
    { id: "contractionMrr", label: "Contraction mrr", kind: "number" },
    { id: "churnMrr", label: "Churn mrr", kind: "number" },
  ],
  outputs: [
    { id: "endingMrr", label: "Ending mrr", kind: "number" },
    { id: "netNewMrr", label: "Net new mrr", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startingMrr: value.startingMrr as number,
      newMrr: value.newMrr as number,
      expansionMrr: value.expansionMrr as number,
      contractionMrr: value.contractionMrr as number,
      churnMrr: value.churnMrr as number,
    }),
});
export const run = tool.execute;
export default tool;
