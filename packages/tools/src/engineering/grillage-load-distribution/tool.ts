import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  weights,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerGrillageLoadN: number;
  readonly callerIndependentParallelMemberStiffnessNM: readonly number[];
}>;
export type Output = Readonly<{
  readonly stiffnessSharedMemberLoadsN: readonly number[];
}>;
const inputFields = [
  {
    id: "callerGrillageLoadN",
    label: "Caller grillage load n",
    kind: "number",
  },
  {
    id: "callerIndependentParallelMemberStiffnessNM",
    label: "Caller independent parallel member stiffness n m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIndependentParallelMemberStiffnessNM.forEach((v) =>
    nonnegative(v, "callerIndependentParallelMemberStiffnessNM"),
  );
  const w = weights(input.callerIndependentParallelMemberStiffnessNM);
  return {
    stiffnessSharedMemberLoadsN: w.map((v) => v * input.callerGrillageLoadN),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGrillageLoadN: 100,
  callerIndependentParallelMemberStiffnessNM: [1, 3],
} satisfies Input;
export const exampleOutput = {
  stiffnessSharedMemberLoadsN: [25, 75],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/grillage-load-distribution",
  title: "Grillage Load Distribution Calculator",
  description:
    "Common-displacement parallel-member grillage idealization with independently established effective stiffnesses, not torsionally coupled grillage analysis. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "stiffnessSharedMemberLoadsN",
      label: "Stiffness shared member loads n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGrillageLoadN: value.callerGrillageLoadN as number,
      callerIndependentParallelMemberStiffnessNM:
        value.callerIndependentParallelMemberStiffnessNM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
