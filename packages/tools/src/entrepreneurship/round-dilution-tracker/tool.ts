import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly initialOwnershipFraction: number;
  readonly roundDilutionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly ownershipAfterRounds: readonly number[];
  readonly finalOwnershipPercent: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.initialOwnershipFraction, "initialOwnershipFraction");
  let ownership = input.initialOwnershipFraction;
  const ownershipAfterRounds = input.roundDilutionFractions.map((v) => {
    fraction(v, "roundDilutionFractions");
    ownership *= 1 - v;
    return ownership;
  });
  return { ownershipAfterRounds, finalOwnershipPercent: 100 * ownership };
};
export const exampleInput = {
  initialOwnershipFraction: 1,
  roundDilutionFractions: [0.2, 0.25],
} satisfies Input;
export const exampleOutput = {
  ownershipAfterRounds: [0.8, 0.6],
  finalOwnershipPercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/round-dilution-tracker",
  title: "Round Dilution Tracker",
  description:
    "Track multiplicative ownership dilution across financing rounds.",
  inputs: [
    {
      id: "initialOwnershipFraction",
      label: "Initial ownership fraction",
      kind: "number",
    },
    {
      id: "roundDilutionFractions",
      label: "Round dilution fractions",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "ownershipAfterRounds",
      label: "Ownership after rounds",
      kind: "numberList",
    },
    {
      id: "finalOwnershipPercent",
      label: "Final ownership percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialOwnershipFraction: value.initialOwnershipFraction as number,
      roundDilutionFractions: value.roundDilutionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
