import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, elapsedStats } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSpinningToCocoonStartDayOffsets: readonly number[];
  readonly observedSpinningToCocoonEndDayOffsets: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedElapsedTimes: readonly number[];
  readonly observedMeanElapsedTime: number;
}>;
const inputFields = [
  {
    id: "observedSpinningToCocoonStartDayOffsets",
    label: "Observed spinning to cocoon start day offsets",
    kind: "numberList",
  },
  {
    id: "observedSpinningToCocoonEndDayOffsets",
    label: "Observed spinning to cocoon end day offsets",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return elapsedStats(
    input.observedSpinningToCocoonStartDayOffsets,
    input.observedSpinningToCocoonEndDayOffsets,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpinningToCocoonStartDayOffsets: [0, 1],
  observedSpinningToCocoonEndDayOffsets: [2, 4],
} satisfies Input;
export const exampleOutput = {
  observedElapsedTimes: [2, 3],
  observedMeanElapsedTime: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/spinning-to-cocoon-days",
  title: "Spinning To Cocoon Days Calculator",
  description:
    "Actual matched cohort SpinningToCocoon event duration evidence, not assumed pupation/spinning lag added to a calendar forecast. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedElapsedTimes",
      label: "Observed elapsed times",
      kind: "numberList",
    },
    {
      id: "observedMeanElapsedTime",
      label: "Observed mean elapsed time",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSpinningToCocoonStartDayOffsets:
        value.observedSpinningToCocoonStartDayOffsets as readonly number[],
      observedSpinningToCocoonEndDayOffsets:
        value.observedSpinningToCocoonEndDayOffsets as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
