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
  readonly observedSurveyPlantReconciliationBaseline: readonly number[];
  readonly observedSurveyPlantReconciliationAfter: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSurveyPlantReconciliationRatios: readonly number[];
  readonly signedSurveyPlantReconciliationChanges: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSurveyPlantReconciliationBaseline",
    label: "Observed survey plant reconciliation baseline",
    kind: "numberList",
  },
  {
    id: "observedSurveyPlantReconciliationAfter",
    label: "Observed survey plant reconciliation after",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSurveyPlantReconciliationBaseline.forEach((v) =>
    positive(v, "observedSurveyPlantReconciliationBaseline"),
  );
  input.observedSurveyPlantReconciliationAfter.forEach((v) =>
    nonnegative(v, "observedSurveyPlantReconciliationAfter"),
  );
  aligned(
    input.observedSurveyPlantReconciliationBaseline,
    input.observedSurveyPlantReconciliationAfter,
    "observedSurveyPlantReconciliationBaseline",
  );
  return {
    observedSurveyPlantReconciliationRatios:
      input.observedSurveyPlantReconciliationAfter.map(
        (v, i) => v / input.observedSurveyPlantReconciliationBaseline[i],
      ),
    signedSurveyPlantReconciliationChanges:
      input.observedSurveyPlantReconciliationAfter.map(
        (v, i) => v - input.observedSurveyPlantReconciliationBaseline[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSurveyPlantReconciliationBaseline: [2, 4],
  observedSurveyPlantReconciliationAfter: [3, 2],
} satisfies Input;
export const exampleOutput = {
  observedSurveyPlantReconciliationRatios: [1.5, 0.5],
  signedSurveyPlantReconciliationChanges: [1, -2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/reconciliation-factor",
  title: "Reconciliation Factor Calculator",
  description:
    "Compare actual surveyed versus independently measured plant dry tonnes, not contained-metal call factor. Signed reductions/increases retained. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSurveyPlantReconciliationRatios",
      label: "Observed survey plant reconciliation ratios",
      kind: "numberList",
    },
    {
      id: "signedSurveyPlantReconciliationChanges",
      label: "Signed survey plant reconciliation changes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSurveyPlantReconciliationBaseline:
        value.observedSurveyPlantReconciliationBaseline as readonly number[],
      observedSurveyPlantReconciliationAfter:
        value.observedSurveyPlantReconciliationAfter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
