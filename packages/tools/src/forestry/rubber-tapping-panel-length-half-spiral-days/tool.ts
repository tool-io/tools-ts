import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRubberPanelAvailableBarkMm: readonly number[];
  readonly callerObservedConsumedBarkMmPerTapping: readonly number[];
  readonly callerTappingDaysPerWeek: number;
}>;
export type Output = Readonly<{
  readonly observedRemainingPanelTapCounts: readonly number[];
  readonly equivalentScheduledPanelWeeks: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRubberPanelAvailableBarkMm",
    label: "Observed rubber panel available bark mm",
    kind: "numberList",
  },
  {
    id: "callerObservedConsumedBarkMmPerTapping",
    label: "Caller observed consumed bark mm per tapping",
    kind: "numberList",
  },
  {
    id: "callerTappingDaysPerWeek",
    label: "Caller tapping days per week",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerObservedConsumedBarkMmPerTapping.forEach((v) =>
    positive(v, "callerObservedConsumedBarkMmPerTapping"),
  );
  input.observedRubberPanelAvailableBarkMm.forEach((v) =>
    nonnegative(v, "observedRubberPanelAvailableBarkMm"),
  );
  aligned(
    input.observedRubberPanelAvailableBarkMm,
    input.callerObservedConsumedBarkMmPerTapping,
    "observedRubberPanelAvailableBarkMm",
  );
  bounded(input.callerTappingDaysPerWeek, "days", 1, 7);
  const taps = input.observedRubberPanelAvailableBarkMm.map((v, i) =>
    Math.floor(v / input.callerObservedConsumedBarkMmPerTapping[i]),
  );
  return {
    observedRemainingPanelTapCounts: taps,
    equivalentScheduledPanelWeeks: taps.map(
      (v) => v / input.callerTappingDaysPerWeek,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRubberPanelAvailableBarkMm: [100, 200],
  callerObservedConsumedBarkMmPerTapping: [2, 4],
  callerTappingDaysPerWeek: 3,
} satisfies Input;
export const exampleOutput = {
  observedRemainingPanelTapCounts: [50, 50],
  equivalentScheduledPanelWeeks: [16.666666666666668, 16.666666666666668],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/rubber-tapping-panel-length-half-spiral-days",
  title: "Rubber Tapping Half-Spiral Panel Days Calculator",
  description:
    "Audit already measured usable half-spiral panel bark and actual per-tap consumption under explicit schedule, not a recommended incision, tapping depth or physiological lifetime. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRemainingPanelTapCounts",
      label: "Observed remaining panel tap counts",
      kind: "numberList",
    },
    {
      id: "equivalentScheduledPanelWeeks",
      label: "Equivalent scheduled panel weeks",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRubberPanelAvailableBarkMm:
        value.observedRubberPanelAvailableBarkMm as readonly number[],
      callerObservedConsumedBarkMmPerTapping:
        value.callerObservedConsumedBarkMmPerTapping as readonly number[],
      callerTappingDaysPerWeek: value.callerTappingDaysPerWeek as number,
    }),
});
export const run = tool.execute;
export default tool;
