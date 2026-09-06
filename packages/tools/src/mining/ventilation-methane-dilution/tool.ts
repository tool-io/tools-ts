import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  finite,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMethaneTraverseFlowsM3Second: readonly number[];
  readonly observedMethaneInletConcentrations: readonly number[];
  readonly observedMethaneOutletConcentrations: readonly number[];
  readonly callerMethanePermittedOutletConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredMeasuredSourceRates: readonly number[];
  readonly steadyModelRequiredFlowsM3Second: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMethaneTraverseFlowsM3Second",
    label: "Observed methane traverse flows m3 second",
    kind: "numberList",
  },
  {
    id: "observedMethaneInletConcentrations",
    label: "Observed methane inlet concentrations",
    kind: "numberList",
  },
  {
    id: "observedMethaneOutletConcentrations",
    label: "Observed methane outlet concentrations",
    kind: "numberList",
  },
  {
    id: "callerMethanePermittedOutletConcentrations",
    label: "Caller methane permitted outlet concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMethaneTraverseFlowsM3Second.forEach((v) =>
    positive(v, "observedMethaneTraverseFlowsM3Second"),
  );
  input.observedMethaneInletConcentrations.forEach((v) =>
    nonnegative(v, "observedMethaneInletConcentrations"),
  );
  input.observedMethaneOutletConcentrations.forEach((v) =>
    nonnegative(v, "observedMethaneOutletConcentrations"),
  );
  input.callerMethanePermittedOutletConcentrations.forEach((v) =>
    nonnegative(v, "callerMethanePermittedOutletConcentrations"),
  );
  aligned(
    input.observedMethaneTraverseFlowsM3Second,
    input.observedMethaneInletConcentrations,
    "observedMethaneTraverseFlowsM3Second",
  );
  aligned(
    input.observedMethaneTraverseFlowsM3Second,
    input.observedMethaneOutletConcentrations,
    "observedMethaneTraverseFlowsM3Second",
  );
  aligned(
    input.observedMethaneTraverseFlowsM3Second,
    input.callerMethanePermittedOutletConcentrations,
    "observedMethaneTraverseFlowsM3Second",
  );
  const source = input.observedMethaneTraverseFlowsM3Second.map((v, i) => {
    const delta =
      input.observedMethaneOutletConcentrations[i] -
      input.observedMethaneInletConcentrations[i];
    nonnegative(delta, "measured source branch");
    return finite(v * delta);
  });
  return {
    inferredMeasuredSourceRates: source,
    steadyModelRequiredFlowsM3Second: source.map((v, i) => {
      const delta =
        input.callerMethanePermittedOutletConcentrations[i] -
        input.observedMethaneInletConcentrations[i];
      positive(delta, "independently established outlet margin");
      return v / delta;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMethaneTraverseFlowsM3Second: [10, 20],
  observedMethaneInletConcentrations: [1, 1],
  observedMethaneOutletConcentrations: [2, 3],
  callerMethanePermittedOutletConcentrations: [3, 5],
} satisfies Input;
export const exampleOutput = {
  inferredMeasuredSourceRates: [10, 40],
  steadyModelRequiredFlowsM3Second: [5, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ventilation-methane-dilution",
  title: "Methane Dilution Ventilation Calculator",
  description:
    "Audit observed Methane tracer traverse concentrations/flow to infer actual source before caller steady dilution comparison, unlike existing supplied-source generic max-flow model; no ventilation setting or mine safety clearance. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredMeasuredSourceRates",
      label: "Inferred measured source rates",
      kind: "numberList",
    },
    {
      id: "steadyModelRequiredFlowsM3Second",
      label: "Steady model required flows m3 second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMethaneTraverseFlowsM3Second:
        value.observedMethaneTraverseFlowsM3Second as readonly number[],
      observedMethaneInletConcentrations:
        value.observedMethaneInletConcentrations as readonly number[],
      observedMethaneOutletConcentrations:
        value.observedMethaneOutletConcentrations as readonly number[],
      callerMethanePermittedOutletConcentrations:
        value.callerMethanePermittedOutletConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
