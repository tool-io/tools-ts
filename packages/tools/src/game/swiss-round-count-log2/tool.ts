import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../shared.js";
export type Input = Readonly<{ readonly participantCount: number }>;
export type Output = Readonly<{
  readonly halvingModelMinimumRounds: number;
  readonly unbeatenSlotCapacityAfterModelRounds: number;
}>;
const inputFields = [
  { id: "participantCount", label: "Participant count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.participantCount, "participants", 2, 1000000);
  const n = Math.ceil(Math.log2(input.participantCount));
  return {
    halvingModelMinimumRounds: n,
    unbeatenSlotCapacityAfterModelRounds: 2 ** n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { participantCount: 17 } satisfies Input;
export const exampleOutput = {
  halvingModelMinimumRounds: 5,
  unbeatenSlotCapacityAfterModelRounds: 32,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/swiss-round-count-log2",
  title: "Swiss Tournament Round Count log₂(n)",
  description:
    "Compute ceil(log2 N) undefeated-halving planning heuristic; Swiss draws, pairing constraints and standings tie-breaks can prevent a unique winner, so not guaranteed required rounds.",
  inputs: inputFields,
  outputs: [
    {
      id: "halvingModelMinimumRounds",
      label: "Halving model minimum rounds",
      kind: "number",
    },
    {
      id: "unbeatenSlotCapacityAfterModelRounds",
      label: "Unbeaten slot capacity after model rounds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ participantCount: value.participantCount as number }),
});
export const run = tool.execute;
export default tool;
