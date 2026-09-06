import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPriorFlowDurationSeconds: number;
  readonly observedShutInDurationsSeconds: readonly number[];
  readonly observedBuildupPressurePa: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedHornerLog10SlopePaPerDecade: number;
  readonly fittedHornerPressureInterceptPa: number;
  readonly hornerFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedPriorFlowDurationSeconds",
    label: "Observed prior flow duration seconds",
    kind: "number",
  },
  {
    id: "observedShutInDurationsSeconds",
    label: "Observed shut in durations seconds",
    kind: "numberList",
  },
  {
    id: "observedBuildupPressurePa",
    label: "Observed buildup pressure pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedPriorFlowDurationSeconds,
    "observedPriorFlowDurationSeconds",
  );
  input.observedShutInDurationsSeconds.forEach((v) =>
    positive(v, "observedShutInDurationsSeconds"),
  );
  input.observedBuildupPressurePa.forEach((v) =>
    positive(v, "observedBuildupPressurePa"),
  );
  const fit = linearFit(
    input.observedShutInDurationsSeconds.map(
      (t) => Math.log1p(input.observedPriorFlowDurationSeconds / t) / Math.LN10,
    ),
    input.observedBuildupPressurePa,
  );
  return {
    fittedHornerLog10SlopePaPerDecade: fit.slope,
    fittedHornerPressureInterceptPa: fit.intercept,
    hornerFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPriorFlowDurationSeconds: 99,
  observedShutInDurationsSeconds: [1, 11],
  observedBuildupPressurePa: [10, 20],
} satisfies Input;
export const exampleOutput = {
  fittedHornerLog10SlopePaPerDecade: -10,
  fittedHornerPressureInterceptPa: 30,
  hornerFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/horner-plot-slope",
  title: "Petroleum Horner Plot Slope Calculator",
  description:
    "Fit actual pressure versus log10[(tp+Δt)/Δt] Horner history, explicit prior-flow/shut-in elapsed durations, negative buildup slope retained; not natural-log slope or pressure-star verification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedHornerLog10SlopePaPerDecade",
      label: "Fitted horner log10 slope pa per decade",
      kind: "number",
    },
    {
      id: "fittedHornerPressureInterceptPa",
      label: "Fitted horner pressure intercept pa",
      kind: "number",
    },
    { id: "hornerFitRSquared", label: "Horner fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedPriorFlowDurationSeconds:
        value.observedPriorFlowDurationSeconds as number,
      observedShutInDurationsSeconds:
        value.observedShutInDurationsSeconds as readonly number[],
      observedBuildupPressurePa:
        value.observedBuildupPressurePa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
