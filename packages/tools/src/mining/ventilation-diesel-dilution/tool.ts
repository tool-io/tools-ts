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
  readonly observedDieselTracerTraverseFlowsM3Second: readonly number[];
  readonly observedDieselTracerInletConcentrations: readonly number[];
  readonly observedDieselTracerOutletConcentrations: readonly number[];
  readonly callerDieselTracerPermittedOutletConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredMeasuredSourceRates: readonly number[];
  readonly steadyModelRequiredFlowsM3Second: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDieselTracerTraverseFlowsM3Second",
    label: "Observed diesel tracer traverse flows m3 second",
    kind: "numberList",
  },
  {
    id: "observedDieselTracerInletConcentrations",
    label: "Observed diesel tracer inlet concentrations",
    kind: "numberList",
  },
  {
    id: "observedDieselTracerOutletConcentrations",
    label: "Observed diesel tracer outlet concentrations",
    kind: "numberList",
  },
  {
    id: "callerDieselTracerPermittedOutletConcentrations",
    label: "Caller diesel tracer permitted outlet concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDieselTracerTraverseFlowsM3Second.forEach((v) =>
    positive(v, "observedDieselTracerTraverseFlowsM3Second"),
  );
  input.observedDieselTracerInletConcentrations.forEach((v) =>
    nonnegative(v, "observedDieselTracerInletConcentrations"),
  );
  input.observedDieselTracerOutletConcentrations.forEach((v) =>
    nonnegative(v, "observedDieselTracerOutletConcentrations"),
  );
  input.callerDieselTracerPermittedOutletConcentrations.forEach((v) =>
    nonnegative(v, "callerDieselTracerPermittedOutletConcentrations"),
  );
  aligned(
    input.observedDieselTracerTraverseFlowsM3Second,
    input.observedDieselTracerInletConcentrations,
    "observedDieselTracerTraverseFlowsM3Second",
  );
  aligned(
    input.observedDieselTracerTraverseFlowsM3Second,
    input.observedDieselTracerOutletConcentrations,
    "observedDieselTracerTraverseFlowsM3Second",
  );
  aligned(
    input.observedDieselTracerTraverseFlowsM3Second,
    input.callerDieselTracerPermittedOutletConcentrations,
    "observedDieselTracerTraverseFlowsM3Second",
  );
  const source = input.observedDieselTracerTraverseFlowsM3Second.map((v, i) => {
    const delta =
      input.observedDieselTracerOutletConcentrations[i] -
      input.observedDieselTracerInletConcentrations[i];
    nonnegative(delta, "measured source branch");
    return finite(v * delta);
  });
  return {
    inferredMeasuredSourceRates: source,
    steadyModelRequiredFlowsM3Second: source.map((v, i) => {
      const delta =
        input.callerDieselTracerPermittedOutletConcentrations[i] -
        input.observedDieselTracerInletConcentrations[i];
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
  observedDieselTracerTraverseFlowsM3Second: [10, 20],
  observedDieselTracerInletConcentrations: [1, 1],
  observedDieselTracerOutletConcentrations: [2, 3],
  callerDieselTracerPermittedOutletConcentrations: [3, 5],
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
  id: "mining/ventilation-diesel-dilution",
  title: "Diesel Dilution Ventilation Calculator",
  description:
    "Audit observed DieselTracer tracer traverse concentrations/flow to infer actual source before caller steady dilution comparison, unlike existing supplied-source generic max-flow model; no ventilation setting or mine safety clearance. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedDieselTracerTraverseFlowsM3Second:
        value.observedDieselTracerTraverseFlowsM3Second as readonly number[],
      observedDieselTracerInletConcentrations:
        value.observedDieselTracerInletConcentrations as readonly number[],
      observedDieselTracerOutletConcentrations:
        value.observedDieselTracerOutletConcentrations as readonly number[],
      callerDieselTracerPermittedOutletConcentrations:
        value.callerDieselTracerPermittedOutletConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
