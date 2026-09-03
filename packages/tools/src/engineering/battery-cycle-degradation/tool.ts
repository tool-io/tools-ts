import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  linearFit,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedEquivalentCycleCounts: readonly number[];
  readonly observedRetainedBatteryCapacityFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedLogCapacityLossPerEquivalentCycle: number;
  readonly capacityLogFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedEquivalentCycleCounts",
    label: "Observed equivalent cycle counts",
    kind: "numberList",
  },
  {
    id: "observedRetainedBatteryCapacityFractions",
    label: "Observed retained battery capacity fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEquivalentCycleCounts.forEach((v) =>
    nonnegative(v, "observedEquivalentCycleCounts"),
  );
  input.observedRetainedBatteryCapacityFractions.forEach((v) =>
    fraction(v, "observedRetainedBatteryCapacityFractions"),
  );
  input.observedRetainedBatteryCapacityFractions.forEach((v) =>
    positive(v, "resolved retained fraction"),
  );
  const f = linearFit(
    input.observedEquivalentCycleCounts,
    input.observedRetainedBatteryCapacityFractions.map(Math.log),
  );
  return {
    fittedLogCapacityLossPerEquivalentCycle: -f.slope,
    capacityLogFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEquivalentCycleCounts: [0, 1, 2],
  observedRetainedBatteryCapacityFractions: [1, 0.9, 0.81],
} satisfies Input;
export const exampleOutput = {
  fittedLogCapacityLossPerEquivalentCycle: 0.10536051565782628,
  capacityLogFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/battery-cycle-degradation",
  title: "Battery Cycle Degradation Calculator",
  description:
    "Extract actual log capacity/cycle trend rather than forward ageing with invented chemistry coefficients; apparent growth remains signed. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedLogCapacityLossPerEquivalentCycle",
      label: "Fitted log capacity loss per equivalent cycle",
      kind: "number",
    },
    {
      id: "capacityLogFitRSquared",
      label: "Capacity log fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEquivalentCycleCounts:
        value.observedEquivalentCycleCounts as readonly number[],
      observedRetainedBatteryCapacityFractions:
        value.observedRetainedBatteryCapacityFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
