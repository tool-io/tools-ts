import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedReservoirLiters: number;
  readonly callerReservedLiters: number;
  readonly observedDailyMatDrawLiters: readonly number[];
  readonly otherMeasuredDailyLossLiters: number;
}>;
export type Output = Readonly<{
  readonly usableReservoirLiters: number;
  readonly modeledMeanDailyDepletionLiters: number;
  readonly estimatedReservoirDays: number;
}>;
const inputFields = [
  {
    id: "observedReservoirLiters",
    label: "Observed reservoir liters",
    kind: "number",
  },
  {
    id: "callerReservedLiters",
    label: "Caller reserved liters",
    kind: "number",
  },
  {
    id: "observedDailyMatDrawLiters",
    label: "Observed daily mat draw liters",
    kind: "numberList",
  },
  {
    id: "otherMeasuredDailyLossLiters",
    label: "Other measured daily loss liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedReservoirLiters, "observedReservoirLiters");
  nonnegative(input.callerReservedLiters, "callerReservedLiters");
  input.observedDailyMatDrawLiters.forEach((v) =>
    nonnegative(v, "observedDailyMatDrawLiters"),
  );
  nonnegative(
    input.otherMeasuredDailyLossLiters,
    "otherMeasuredDailyLossLiters",
  );
  if (
    !input.observedDailyMatDrawLiters.length ||
    input.callerReservedLiters > input.observedReservoirLiters
  )
    simpleError(
      "inventory",
      "Observed draw and reserve within current inventory required.",
    );
  const usable = input.observedReservoirLiters - input.callerReservedLiters,
    draw =
      mean(input.observedDailyMatDrawLiters) +
      input.otherMeasuredDailyLossLiters;
  positive(draw, "depletion");
  return {
    usableReservoirLiters: usable,
    modeledMeanDailyDepletionLiters: draw,
    estimatedReservoirDays: usable / draw,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReservoirLiters: 20,
  callerReservedLiters: 2,
  observedDailyMatDrawLiters: [2, 4],
  otherMeasuredDailyLossLiters: 1,
} satisfies Input;
export const exampleOutput = {
  usableReservoirLiters: 18,
  modeledMeanDailyDepletionLiters: 4,
  estimatedReservoirDays: 4.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/capillary-mat-reservoir-days",
  title: "Capillary Mat Reservoir Days Calculator",
  description:
    "Budget actual capillary-mat reservoir against measured daily draw and independent other losses; no crop watering schedule, constant weather guarantee or pump dry-run protection.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableReservoirLiters",
      label: "Usable reservoir liters",
      kind: "number",
    },
    {
      id: "modeledMeanDailyDepletionLiters",
      label: "Modeled mean daily depletion liters",
      kind: "number",
    },
    {
      id: "estimatedReservoirDays",
      label: "Estimated reservoir days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReservoirLiters: value.observedReservoirLiters as number,
      callerReservedLiters: value.callerReservedLiters as number,
      observedDailyMatDrawLiters:
        value.observedDailyMatDrawLiters as readonly number[],
      otherMeasuredDailyLossLiters:
        value.otherMeasuredDailyLossLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
