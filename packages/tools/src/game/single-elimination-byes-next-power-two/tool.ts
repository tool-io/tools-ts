import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../shared.js";
export type Input = Readonly<{ readonly entrantCount: number }>;
export type Output = Readonly<{
  readonly bracketSlotCount: number;
  readonly firstRoundByeCount: number;
  readonly firstRoundContestedMatchCount: number;
  readonly totalContestedMatches: number;
}>;
const inputFields = [
  { id: "entrantCount", label: "Entrant count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.entrantCount, "entrants", 2, 1000000);
  const slots = 2 ** Math.ceil(Math.log2(input.entrantCount)),
    byes = slots - input.entrantCount;
  return {
    bracketSlotCount: slots,
    firstRoundByeCount: byes,
    firstRoundContestedMatchCount: (input.entrantCount - byes) / 2,
    totalContestedMatches: input.entrantCount - 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { entrantCount: 10 } satisfies Input;
export const exampleOutput = {
  bracketSlotCount: 16,
  firstRoundByeCount: 6,
  firstRoundContestedMatchCount: 2,
  totalContestedMatches: 9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/single-elimination-byes-next-power-two",
  title: "Single-Elim Byes Next Power of Two",
  description:
    "Plan next-power-two single-elimination bracket with separate first-round byes/contests and total N−1 contests; no seeding or third-place match assumed.",
  inputs: inputFields,
  outputs: [
    { id: "bracketSlotCount", label: "Bracket slot count", kind: "number" },
    {
      id: "firstRoundByeCount",
      label: "First round bye count",
      kind: "number",
    },
    {
      id: "firstRoundContestedMatchCount",
      label: "First round contested match count",
      kind: "number",
    },
    {
      id: "totalContestedMatches",
      label: "Total contested matches",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ entrantCount: value.entrantCount as number }),
});
export const run = tool.execute;
export default tool;
