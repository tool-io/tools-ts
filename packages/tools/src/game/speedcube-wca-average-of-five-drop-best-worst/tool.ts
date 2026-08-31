import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, mean } from "../shared.js";
export type Input = Readonly<{
  readonly fiveSolveCentiseconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly retainedThreeCentiseconds: readonly number[];
  readonly averageIsDnf: boolean;
  readonly unroundedAverageCentiseconds: number;
  readonly roundedAverageCentiseconds: number;
}>;
const inputFields = [
  {
    id: "fiveSolveCentiseconds",
    label: "Five solve centiseconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.fiveSolveCentiseconds.length !== 5 ||
    input.fiveSolveCentiseconds.some(
      (v) => v !== -1 && (!Number.isSafeInteger(v) || v <= 0),
    )
  )
    simpleError(
      "times",
      "Exactly five positive integer centisecond times; −1 means DNF.",
    );
  const sorted = [...input.fiveSolveCentiseconds].sort(
      (a, b) => (a === -1 ? Infinity : a) - (b === -1 ? Infinity : b),
    ),
    keep = sorted.slice(1, 4),
    dnf = keep.includes(-1),
    avg = dnf ? -1 : mean(keep);
  return {
    retainedThreeCentiseconds: keep,
    averageIsDnf: dnf,
    unroundedAverageCentiseconds: avg,
    roundedAverageCentiseconds: dnf ? -1 : Math.round(avg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fiveSolveCentiseconds: [100, 200, 300, 400, 500],
} satisfies Input;
export const exampleOutput = {
  retainedThreeCentiseconds: [200, 300, 400],
  averageIsDnf: false,
  unroundedAverageCentiseconds: 300,
  roundedAverageCentiseconds: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/speedcube-wca-average-of-five-drop-best-worst",
  title: "WCA Ao5 Drop Best/Worst Average",
  description:
    "Compute WCA-style Ao5 from caller penalty-adjusted centisecond times, dropping one best/worst with DNF worst; two DNFs make average DNF. Raw judge penalties and current event regulations are not adjudicated.",
  inputs: inputFields,
  outputs: [
    {
      id: "retainedThreeCentiseconds",
      label: "Retained three centiseconds",
      kind: "numberList",
    },
    { id: "averageIsDnf", label: "Average is dnf", kind: "boolean" },
    {
      id: "unroundedAverageCentiseconds",
      label: "Unrounded average centiseconds",
      kind: "number",
    },
    {
      id: "roundedAverageCentiseconds",
      label: "Rounded average centiseconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fiveSolveCentiseconds: value.fiveSolveCentiseconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
