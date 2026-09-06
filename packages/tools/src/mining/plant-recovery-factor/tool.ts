import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPlantStageRecoveryBaseline: readonly number[];
  readonly observedPlantStageRecoveryAfter: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPlantStageRecoveryRatios: readonly number[];
  readonly signedPlantStageRecoveryChanges: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPlantStageRecoveryBaseline",
    label: "Observed plant stage recovery baseline",
    kind: "numberList",
  },
  {
    id: "observedPlantStageRecoveryAfter",
    label: "Observed plant stage recovery after",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPlantStageRecoveryBaseline.forEach((v) =>
    positive(v, "observedPlantStageRecoveryBaseline"),
  );
  input.observedPlantStageRecoveryAfter.forEach((v) =>
    nonnegative(v, "observedPlantStageRecoveryAfter"),
  );
  aligned(
    input.observedPlantStageRecoveryBaseline,
    input.observedPlantStageRecoveryAfter,
    "observedPlantStageRecoveryBaseline",
  );
  return {
    observedPlantStageRecoveryRatios: input.observedPlantStageRecoveryAfter.map(
      (v, i) => v / input.observedPlantStageRecoveryBaseline[i],
    ),
    signedPlantStageRecoveryChanges: input.observedPlantStageRecoveryAfter.map(
      (v, i) => v - input.observedPlantStageRecoveryBaseline[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlantStageRecoveryBaseline: [2, 4],
  observedPlantStageRecoveryAfter: [3, 2],
} satisfies Input;
export const exampleOutput = {
  observedPlantStageRecoveryRatios: [1.5, 0.5],
  signedPlantStageRecoveryChanges: [1, -2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/plant-recovery-factor",
  title: "Plant Recovery Factor Calculator",
  description:
    "Compare actual plant-stage contained-metal inlet/outlet ledgers, not generic multi-product dry assay closure. Signed reductions/increases retained. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPlantStageRecoveryRatios",
      label: "Observed plant stage recovery ratios",
      kind: "numberList",
    },
    {
      id: "signedPlantStageRecoveryChanges",
      label: "Signed plant stage recovery changes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlantStageRecoveryBaseline:
        value.observedPlantStageRecoveryBaseline as readonly number[],
      observedPlantStageRecoveryAfter:
        value.observedPlantStageRecoveryAfter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
