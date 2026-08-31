import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, binary, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly adjacentProductionNumbers: readonly number[];
  readonly robberBlockedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly perHexPrintedProbabilityPips: readonly number[];
  readonly expectedUnblockedResourceUnitsPerRoll: number;
}>;
const inputFields = [
  {
    id: "adjacentProductionNumbers",
    label: "Adjacent production numbers",
    kind: "numberList",
  },
  {
    id: "robberBlockedFlags",
    label: "Robber blocked flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.adjacentProductionNumbers,
    input.robberBlockedFlags,
    "adjacentProductionNumbers",
  );
  binary(input.robberBlockedFlags, "robber");
  const p = input.adjacentProductionNumbers.map((v) => {
    bounded(v, "number", 2, 12);
    if (v === 7)
      simpleError("number", "Seven is not a productive numbered hex.");
    return 6 - Math.abs(7 - v);
  });
  return {
    perHexPrintedProbabilityPips: p,
    expectedUnblockedResourceUnitsPerRoll: p.reduce(
      (s, v, i) => s + (v * (1 - input.robberBlockedFlags[i])) / 36,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  adjacentProductionNumbers: [6, 8],
  robberBlockedFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  perHexPrintedProbabilityPips: [5, 5],
  expectedUnblockedResourceUnitsPerRoll: 0.1388888888888889,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/catan-dot-probability-pip-resource",
  title: "Catan Dot Probability Pips",
  description:
    "Audit actual adjacent Catan number tokens and robber exclusions; one unit per listed hex, summed resource expectation may exceed one and is not probability of any production. Cities/shortages omitted.",
  inputs: inputFields,
  outputs: [
    {
      id: "perHexPrintedProbabilityPips",
      label: "Per hex printed probability pips",
      kind: "numberList",
    },
    {
      id: "expectedUnblockedResourceUnitsPerRoll",
      label: "Expected unblocked resource units per roll",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      adjacentProductionNumbers:
        value.adjacentProductionNumbers as readonly number[],
      robberBlockedFlags: value.robberBlockedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
