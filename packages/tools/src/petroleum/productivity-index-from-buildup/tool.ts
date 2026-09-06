import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedNaturalLogHornerRatios: readonly number[];
  readonly observedBuildupPressuresPa: readonly number[];
  readonly observedPriorFlowingPressurePa: number;
  readonly observedPriorFlowRateM3Day: number;
}>;
export type Output = Readonly<{
  readonly fittedBuildupPressureInterceptPa: number;
  readonly buildupInferredPiM3DayPa: number;
}>;
const inputFields = [
  {
    id: "observedNaturalLogHornerRatios",
    label: "Observed natural log horner ratios",
    kind: "numberList",
  },
  {
    id: "observedBuildupPressuresPa",
    label: "Observed buildup pressures pa",
    kind: "numberList",
  },
  {
    id: "observedPriorFlowingPressurePa",
    label: "Observed prior flowing pressure pa",
    kind: "number",
  },
  {
    id: "observedPriorFlowRateM3Day",
    label: "Observed prior flow rate m3 day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBuildupPressuresPa.forEach((v) =>
    positive(v, "observedBuildupPressuresPa"),
  );
  input.observedNaturalLogHornerRatios.forEach((v) =>
    nonnegative(v, "observedNaturalLogHornerRatios"),
  );
  nonnegative(
    input.observedPriorFlowingPressurePa,
    "observedPriorFlowingPressurePa",
  );
  nonnegative(input.observedPriorFlowRateM3Day, "observedPriorFlowRateM3Day");
  const f = linearFit(
      input.observedNaturalLogHornerRatios,
      input.observedBuildupPressuresPa,
    ),
    draw = f.intercept - input.observedPriorFlowingPressurePa;
  positive(draw, "fitted buildup drawdown");
  return {
    fittedBuildupPressureInterceptPa: f.intercept,
    buildupInferredPiM3DayPa: input.observedPriorFlowRateM3Day / draw,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNaturalLogHornerRatios: [0, 1, 2],
  observedBuildupPressuresPa: [10, 9, 8],
  observedPriorFlowingPressurePa: 5,
  observedPriorFlowRateM3Day: 20,
} satisfies Input;
export const exampleOutput = {
  fittedBuildupPressureInterceptPa: 10,
  buildupInferredPiM3DayPa: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/productivity-index-from-buildup",
  title: "Petroleum Productivity Index From Buildup Calculator",
  description:
    "Extract Horner-fit intercept and matched prior-flow PI from actual selected buildup trace, natural-log Horner input explicit; not supplied-reservoir-pressure simplePI or full transient interpretation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedBuildupPressureInterceptPa",
      label: "Fitted buildup pressure intercept pa",
      kind: "number",
    },
    {
      id: "buildupInferredPiM3DayPa",
      label: "Buildup inferred pi m3 day pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNaturalLogHornerRatios:
        value.observedNaturalLogHornerRatios as readonly number[],
      observedBuildupPressuresPa:
        value.observedBuildupPressuresPa as readonly number[],
      observedPriorFlowingPressurePa:
        value.observedPriorFlowingPressurePa as number,
      observedPriorFlowRateM3Day: value.observedPriorFlowRateM3Day as number,
    }),
});
export const run = tool.execute;
export default tool;
