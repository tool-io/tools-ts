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
  readonly observedDustTraverseFlowsM3Second: readonly number[];
  readonly observedDustInletConcentrations: readonly number[];
  readonly observedDustOutletConcentrations: readonly number[];
  readonly callerDustPermittedOutletConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredMeasuredSourceRates: readonly number[];
  readonly steadyModelRequiredFlowsM3Second: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDustTraverseFlowsM3Second",
    label: "Observed dust traverse flows m3 second",
    kind: "numberList",
  },
  {
    id: "observedDustInletConcentrations",
    label: "Observed dust inlet concentrations",
    kind: "numberList",
  },
  {
    id: "observedDustOutletConcentrations",
    label: "Observed dust outlet concentrations",
    kind: "numberList",
  },
  {
    id: "callerDustPermittedOutletConcentrations",
    label: "Caller dust permitted outlet concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDustTraverseFlowsM3Second.forEach((v) =>
    positive(v, "observedDustTraverseFlowsM3Second"),
  );
  input.observedDustInletConcentrations.forEach((v) =>
    nonnegative(v, "observedDustInletConcentrations"),
  );
  input.observedDustOutletConcentrations.forEach((v) =>
    nonnegative(v, "observedDustOutletConcentrations"),
  );
  input.callerDustPermittedOutletConcentrations.forEach((v) =>
    nonnegative(v, "callerDustPermittedOutletConcentrations"),
  );
  aligned(
    input.observedDustTraverseFlowsM3Second,
    input.observedDustInletConcentrations,
    "observedDustTraverseFlowsM3Second",
  );
  aligned(
    input.observedDustTraverseFlowsM3Second,
    input.observedDustOutletConcentrations,
    "observedDustTraverseFlowsM3Second",
  );
  aligned(
    input.observedDustTraverseFlowsM3Second,
    input.callerDustPermittedOutletConcentrations,
    "observedDustTraverseFlowsM3Second",
  );
  const source = input.observedDustTraverseFlowsM3Second.map((v, i) => {
    const delta =
      input.observedDustOutletConcentrations[i] -
      input.observedDustInletConcentrations[i];
    nonnegative(delta, "measured source branch");
    return finite(v * delta);
  });
  return {
    inferredMeasuredSourceRates: source,
    steadyModelRequiredFlowsM3Second: source.map((v, i) => {
      const delta =
        input.callerDustPermittedOutletConcentrations[i] -
        input.observedDustInletConcentrations[i];
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
  observedDustTraverseFlowsM3Second: [10, 20],
  observedDustInletConcentrations: [1, 1],
  observedDustOutletConcentrations: [2, 3],
  callerDustPermittedOutletConcentrations: [3, 5],
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
  id: "mining/ventilation-dust-dilution",
  title: "Dust Dilution Ventilation Calculator",
  description:
    "Audit observed Dust tracer traverse concentrations/flow to infer actual source before caller steady dilution comparison, unlike existing supplied-source generic max-flow model; no ventilation setting or mine safety clearance. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedDustTraverseFlowsM3Second:
        value.observedDustTraverseFlowsM3Second as readonly number[],
      observedDustInletConcentrations:
        value.observedDustInletConcentrations as readonly number[],
      observedDustOutletConcentrations:
        value.observedDustOutletConcentrations as readonly number[],
      callerDustPermittedOutletConcentrations:
        value.callerDustPermittedOutletConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
