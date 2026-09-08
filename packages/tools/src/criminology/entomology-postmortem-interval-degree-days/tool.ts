import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedBinTemperaturesCelsius: readonly number[];
  readonly observedBinDurationsDays: readonly number[];
  readonly callerValidatedDevelopmentBaseCelsius: number;
  readonly callerValidatedDevelopmentThresholdDegreeDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedBinTemperaturesCelsius",
    label: "Observed bin temperatures celsius",
    kind: "numberList",
  },
  {
    id: "observedBinDurationsDays",
    label: "Observed bin durations days",
    kind: "numberList",
  },
  {
    id: "callerValidatedDevelopmentBaseCelsius",
    label: "Caller validated development base celsius",
    kind: "number",
  },
  {
    id: "callerValidatedDevelopmentThresholdDegreeDays",
    label: "Caller validated development threshold degree days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedBinTemperaturesCelsius,
    input.observedBinDurationsDays,
    "history",
  );
  input.observedBinDurationsDays.forEach((v) => positive(v, "duration"));
  positive(input.callerValidatedDevelopmentThresholdDegreeDays, "threshold");
  let total = 0,
    time = 0,
    cross = -1;
  for (let i = 0; i < input.observedBinTemperaturesCelsius.length; i++) {
    const rate = Math.max(
        0,
        input.observedBinTemperaturesCelsius[i] -
          input.callerValidatedDevelopmentBaseCelsius,
      ),
      inc = rate * input.observedBinDurationsDays[i];
    if (
      cross < 0 &&
      rate > 0 &&
      total + inc >= input.callerValidatedDevelopmentThresholdDegreeDays
    )
      cross =
        time +
        (input.callerValidatedDevelopmentThresholdDegreeDays - total) / rate;
    total += inc;
    time += input.observedBinDurationsDays[i];
  }
  return {
    observedAccumulationDegreeDays: total,
    conditionalThresholdElapsedDays: cross,
    thresholdReached: cross >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedBinTemperaturesCelsius: [20, 30],
    observedBinDurationsDays: [1, 1],
    callerValidatedDevelopmentBaseCelsius: 10,
    callerValidatedDevelopmentThresholdDegreeDays: 20,
  },
  output: {
    result: {
      observedAccumulationDegreeDays: 30,
      conditionalThresholdElapsedDays: 1.5,
      thresholdReached: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/entomology-postmortem-interval-degree-days",
  title: "Entomology Postmortem Interval Degree Days Calculator",
  description:
    "Integrate actual piecewise-constant thermal history and locate independently validated development threshold. \u22121means unreached; not death-time/PMIcertainty, species/stage identification or neglect temperature/nonlinear/colonization uncertainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
