import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualPreviousPuppyMassGrams: number;
  readonly actualCurrentPuppyMassGrams: number;
  readonly actualElapsedDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPreviousPuppyMassGrams",
    label: "Actual previous puppy mass grams",
    kind: "number",
  },
  {
    id: "actualCurrentPuppyMassGrams",
    label: "Actual current puppy mass grams",
    kind: "number",
  },
  { id: "actualElapsedDays", label: "Actual elapsed days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualPreviousPuppyMassGrams, "previous");
  positive(input.actualCurrentPuppyMassGrams, "current");
  positive(input.actualElapsedDays, "elapsed");
  const g =
    input.actualCurrentPuppyMassGrams - input.actualPreviousPuppyMassGrams;
  return {
    signedObservedPuppyMassGainGramsPerDay: g / input.actualElapsedDays,
    signedBaselineRelativeGainPercentPerDay:
      (100 * g) / input.actualPreviousPuppyMassGrams / input.actualElapsedDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPreviousPuppyMassGrams: 200,
    actualCurrentPuppyMassGrams: 220,
    actualElapsedDays: 1,
  },
  output: {
    result: {
      signedObservedPuppyMassGainGramsPerDay: 20,
      signedBaselineRelativeGainPercentPerDay: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/neonatal-weight-gain-daily-puppy",
  title: "Puppy Neonatal Daily Weight Gain Calculator",
  description:
    "Actual comparable neonatal puppy weight change and baseline-relative change/day. Negative changes retained; not universal growth target, feeding prescription or reassurance about neonatal health.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
