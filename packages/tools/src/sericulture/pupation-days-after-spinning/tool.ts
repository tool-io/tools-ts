import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, elapsedStats } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSpinningToPupationStartDayOffsets: readonly number[];
  readonly observedSpinningToPupationEndDayOffsets: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedElapsedTimes: readonly number[];
  readonly observedMeanElapsedTime: number;
}>;
const inputFields = [
  {
    id: "observedSpinningToPupationStartDayOffsets",
    label: "Observed spinning to pupation start day offsets",
    kind: "numberList",
  },
  {
    id: "observedSpinningToPupationEndDayOffsets",
    label: "Observed spinning to pupation end day offsets",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return elapsedStats(
    input.observedSpinningToPupationStartDayOffsets,
    input.observedSpinningToPupationEndDayOffsets,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSpinningToPupationStartDayOffsets: [0, 1],
  observedSpinningToPupationEndDayOffsets: [2, 4],
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
  id: "sericulture/pupation-days-after-spinning",
  title: "Pupation Days After Spinning Calculator",
  description:
    "Actual matched cohort SpinningToPupation event duration evidence, not assumed pupation/spinning lag added to a calendar forecast. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      observedSpinningToPupationStartDayOffsets:
        value.observedSpinningToPupationStartDayOffsets as readonly number[],
      observedSpinningToPupationEndDayOffsets:
        value.observedSpinningToPupationEndDayOffsets as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
