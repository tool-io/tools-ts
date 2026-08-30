import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly feedTonnesPerHour: number;
  readonly feedUndersizeFraction: number;
  readonly undersizeProductTonnesPerHour: number;
  readonly undersizeProductFineFraction: number;
}>;
export type Output = Readonly<{
  readonly finesRecoveryFraction: number;
  readonly coarseRecoveryFraction: number;
  readonly combinedSeparationEfficiency: number;
}>;
const inputFields = [
  { id: "feedTonnesPerHour", label: "Feed tonnes per hour", kind: "number" },
  {
    id: "feedUndersizeFraction",
    label: "Feed undersize fraction",
    kind: "number",
  },
  {
    id: "undersizeProductTonnesPerHour",
    label: "Undersize product tonnes per hour",
    kind: "number",
  },
  {
    id: "undersizeProductFineFraction",
    label: "Undersize product fine fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.feedTonnesPerHour, "feedTonnesPerHour");
  positive(input.feedUndersizeFraction, "feedUndersizeFraction");
  nonnegative(
    input.undersizeProductTonnesPerHour,
    "undersizeProductTonnesPerHour",
  );
  fraction(input.feedUndersizeFraction, "feedUndersizeFraction");
  fraction(input.undersizeProductFineFraction, "undersizeProductFineFraction");
  if (input.feedUndersizeFraction === 1)
    simpleError("feedUndersizeFraction", "Both feed classes required.");
  const f = input.feedTonnesPerHour * input.feedUndersizeFraction,
    c = input.feedTonnesPerHour - f,
    uf =
      input.undersizeProductTonnesPerHour * input.undersizeProductFineFraction,
    uc = input.undersizeProductTonnesPerHour - uf,
    finesRecoveryFraction = fraction(uf / f, "fineBalance"),
    coarseRecoveryFraction = fraction((c - uc) / c, "coarseBalance");
  return {
    finesRecoveryFraction,
    coarseRecoveryFraction,
    combinedSeparationEfficiency:
      finesRecoveryFraction * coarseRecoveryFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedTonnesPerHour: 100,
  feedUndersizeFraction: 0.4,
  undersizeProductTonnesPerHour: 40,
  undersizeProductFineFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  finesRecoveryFraction: 0.9,
  coarseRecoveryFraction: 0.9333333333333333,
  combinedSeparationEfficiency: 0.84,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/screen-efficiency",
  title: "Screen Efficiency",
  description:
    "Calculate screen class recoveries and their product from a two-class dry balance; explicitly a recovery product, not undersize purity.",
  inputs: inputFields,
  outputs: [
    {
      id: "finesRecoveryFraction",
      label: "Fines recovery fraction",
      kind: "number",
    },
    {
      id: "coarseRecoveryFraction",
      label: "Coarse recovery fraction",
      kind: "number",
    },
    {
      id: "combinedSeparationEfficiency",
      label: "Combined separation efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedTonnesPerHour: value.feedTonnesPerHour as number,
      feedUndersizeFraction: value.feedUndersizeFraction as number,
      undersizeProductTonnesPerHour:
        value.undersizeProductTonnesPerHour as number,
      undersizeProductFineFraction:
        value.undersizeProductFineFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
