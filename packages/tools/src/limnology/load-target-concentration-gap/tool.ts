import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedPhosphorusMgM3: number;
  readonly callerTargetPhosphorusMgM3: number;
  readonly matchedLakeVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly signedConcentrationGapMgM3: number;
  readonly signedWellMixedInventoryGapKg: number;
}>;
const inputFields = [
  {
    id: "observedPhosphorusMgM3",
    label: "Observed phosphorus mg m3",
    kind: "number",
  },
  {
    id: "callerTargetPhosphorusMgM3",
    label: "Caller target phosphorus mg m3",
    kind: "number",
  },
  {
    id: "matchedLakeVolumeM3",
    label: "Matched lake volume m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.matchedLakeVolumeM3, "matchedLakeVolumeM3");
  nonnegative(input.observedPhosphorusMgM3, "observedPhosphorusMgM3");
  nonnegative(input.callerTargetPhosphorusMgM3, "callerTargetPhosphorusMgM3");
  const gap = input.observedPhosphorusMgM3 - input.callerTargetPhosphorusMgM3;
  return {
    signedConcentrationGapMgM3: gap,
    signedWellMixedInventoryGapKg: (gap * input.matchedLakeVolumeM3) / 1e6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPhosphorusMgM3: 30,
  callerTargetPhosphorusMgM3: 20,
  matchedLakeVolumeM3: 1000,
} satisfies Input;
export const exampleOutput = {
  signedConcentrationGapMgM3: 10,
  signedWellMixedInventoryGapKg: 0.01,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/load-target-concentration-gap",
  title: "Load Target Concentration Gap Calculator",
  description:
    "Reconcile actual concentration/target gap to instantaneous well-mixed inventory difference, not converting concentration gap to annual load reduction without residence/retention evidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedConcentrationGapMgM3",
      label: "Signed concentration gap mg m3",
      kind: "number",
    },
    {
      id: "signedWellMixedInventoryGapKg",
      label: "Signed well mixed inventory gap kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPhosphorusMgM3: value.observedPhosphorusMgM3 as number,
      callerTargetPhosphorusMgM3: value.callerTargetPhosphorusMgM3 as number,
      matchedLakeVolumeM3: value.matchedLakeVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
