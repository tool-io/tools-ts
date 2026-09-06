import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOxygenInletFractions: readonly number[];
  readonly observedOxygenOutletFractions: readonly number[];
  readonly observedMeasuredAirflowsM3Second: readonly number[];
  readonly callerMinimumOxygenOutletFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredObservedOxygenConsumptionM3Second: readonly number[];
  readonly steadyModelOxygenRequiredAirflowsM3Second: readonly number[];
}>;
const inputFields = [
  {
    id: "observedOxygenInletFractions",
    label: "Observed oxygen inlet fractions",
    kind: "numberList",
  },
  {
    id: "observedOxygenOutletFractions",
    label: "Observed oxygen outlet fractions",
    kind: "numberList",
  },
  {
    id: "observedMeasuredAirflowsM3Second",
    label: "Observed measured airflows m3 second",
    kind: "numberList",
  },
  {
    id: "callerMinimumOxygenOutletFractions",
    label: "Caller minimum oxygen outlet fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMeasuredAirflowsM3Second.forEach((v) =>
    positive(v, "observedMeasuredAirflowsM3Second"),
  );
  input.observedOxygenInletFractions.forEach((v) =>
    fraction(v, "observedOxygenInletFractions"),
  );
  input.observedOxygenOutletFractions.forEach((v) =>
    fraction(v, "observedOxygenOutletFractions"),
  );
  input.callerMinimumOxygenOutletFractions.forEach((v) =>
    fraction(v, "callerMinimumOxygenOutletFractions"),
  );
  aligned(
    input.observedOxygenInletFractions,
    input.observedOxygenOutletFractions,
    "observedOxygenInletFractions",
  );
  aligned(
    input.observedOxygenInletFractions,
    input.observedMeasuredAirflowsM3Second,
    "observedOxygenInletFractions",
  );
  aligned(
    input.observedOxygenInletFractions,
    input.callerMinimumOxygenOutletFractions,
    "observedOxygenInletFractions",
  );
  const consumed = input.observedOxygenInletFractions.map((v, i) => {
    const delta = v - input.observedOxygenOutletFractions[i];
    nonnegative(delta, "consumption");
    return delta * input.observedMeasuredAirflowsM3Second[i];
  });
  return {
    inferredObservedOxygenConsumptionM3Second: consumed,
    steadyModelOxygenRequiredAirflowsM3Second: consumed.map((v, i) => {
      const margin =
        input.observedOxygenInletFractions[i] -
        input.callerMinimumOxygenOutletFractions[i];
      positive(margin, "oxygen margin");
      return v / margin;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOxygenInletFractions: [0.21, 0.21],
  observedOxygenOutletFractions: [0.2, 0.19],
  observedMeasuredAirflowsM3Second: [10, 20],
  callerMinimumOxygenOutletFractions: [0.19, 0.19],
} satisfies Input;
export const exampleOutput = {
  inferredObservedOxygenConsumptionM3Second: [0.1, 0.4],
  steadyModelOxygenRequiredAirflowsM3Second: [5, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ventilation-oxygen-requirement",
  title: "Oxygen Requirement Ventilation Calculator",
  description:
    "Audit actual inlet/outlet oxygen consumption and independent air traverse before explicit caller minimum comparison, no assumed worker metabolism, oxygen enrichment procedure or breathable mine assurance. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredObservedOxygenConsumptionM3Second",
      label: "Inferred observed oxygen consumption m3 second",
      kind: "numberList",
    },
    {
      id: "steadyModelOxygenRequiredAirflowsM3Second",
      label: "Steady model oxygen required airflows m3 second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOxygenInletFractions:
        value.observedOxygenInletFractions as readonly number[],
      observedOxygenOutletFractions:
        value.observedOxygenOutletFractions as readonly number[],
      observedMeasuredAirflowsM3Second:
        value.observedMeasuredAirflowsM3Second as readonly number[],
      callerMinimumOxygenOutletFractions:
        value.callerMinimumOxygenOutletFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
