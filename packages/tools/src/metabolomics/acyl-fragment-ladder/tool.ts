import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fragmentMz: readonly number[];
  readonly expectedLadderStepMz: number;
  readonly stepToleranceMz: number;
}>;
export type Output = Readonly<{
  readonly matchedSteps: number;
  readonly ladderStartMz: number;
  readonly longestRun: number;
}>;
export const calculate = (input: Input): Output => {
  const x = input.fragmentMz;
  if (
    x.length < 2 ||
    x.some((v, i) => i > 0 && v <= x[i - 1]) ||
    input.expectedLadderStepMz <= 0 ||
    input.stepToleranceMz < 0
  )
    simpleError(
      "fragmentMz",
      "Sorted fragment masses and positive ladder step required.",
    );
  let matchedSteps = 0,
    longestRun = 1,
    run = 1;
  for (let i = 1; i < x.length; i++) {
    if (
      Math.abs(x[i] - x[i - 1] - input.expectedLadderStepMz) <=
      input.stepToleranceMz
    ) {
      matchedSteps++;
      run++;
    } else run = 1;
    longestRun = Math.max(longestRun, run);
  }
  return { matchedSteps, ladderStartMz: x[0], longestRun };
};
export const exampleInput = {
  fragmentMz: [100, 114, 128, 150],
  expectedLadderStepMz: 14,
  stepToleranceMz: 0.1,
} satisfies Input;
export const exampleOutput = {
  matchedSteps: 2,
  ladderStartMz: 100,
  longestRun: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/acyl-fragment-ladder",
  title: "Acyl Fragment Ladder",
  description: "Count consecutive MS/MS acyl-chain fragment mass differences.",
  inputs: [
    { id: "fragmentMz", kind: "numberList", label: "Fragment mz" },
    {
      id: "expectedLadderStepMz",
      kind: "number",
      label: "Expected ladder step mz",
    },
    { id: "stepToleranceMz", kind: "number", label: "Step tolerance mz" },
  ],
  outputs: [
    { id: "matchedSteps", kind: "number", label: "Matched steps" },
    { id: "ladderStartMz", kind: "number", label: "Ladder start mz" },
    { id: "longestRun", kind: "number", label: "Longest run" },
  ],
  calculate: (value) =>
    calculate({
      fragmentMz: value.fragmentMz as readonly number[],
      expectedLadderStepMz: value.expectedLadderStepMz as number,
      stepToleranceMz: value.stepToleranceMz as number,
    }),
});
export const run = tool.execute;
export default tool;
