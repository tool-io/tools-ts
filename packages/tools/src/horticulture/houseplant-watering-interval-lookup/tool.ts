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
  aligned,
  strictlyIncreasing,
  interpolate,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedDaysAfterWatering: readonly number[];
  readonly observedPotMassesGrams: readonly number[];
  readonly callerIndependentlyEstablishedRewaterMassGrams: number;
}>;
export type Output = Readonly<{
  readonly observedRewaterMassCrossingAvailable: boolean;
  readonly interpolatedDaysToCallerMassThreshold: number;
  readonly lastObservedPotMassGrams: number;
}>;
const inputFields = [
  {
    id: "observedDaysAfterWatering",
    label: "Observed days after watering",
    kind: "numberList",
  },
  {
    id: "observedPotMassesGrams",
    label: "Observed pot masses grams",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedRewaterMassGrams",
    label: "Caller independently established rewater mass grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPotMassesGrams.forEach((v) =>
    positive(v, "observedPotMassesGrams"),
  );
  positive(
    input.callerIndependentlyEstablishedRewaterMassGrams,
    "callerIndependentlyEstablishedRewaterMassGrams",
  );
  strictlyIncreasing(input.observedDaysAfterWatering, "days");
  input.observedDaysAfterWatering.forEach((v) => nonnegative(v, "days"));
  aligned(
    input.observedDaysAfterWatering,
    input.observedPotMassesGrams,
    "mass",
  );
  if (
    input.observedPotMassesGrams.some(
      (v, i) => i > 0 && v >= input.observedPotMassesGrams[i - 1],
    )
  )
    simpleError(
      "branch",
      "Strictly decreasing observed matched pot-mass branch required.",
    );
  const target = input.callerIndependentlyEstablishedRewaterMassGrams,
    last = input.observedPotMassesGrams.at(-1)!;
  if (target > input.observedPotMassesGrams[0])
    simpleError(
      "censoring",
      "Threshold already exceeded before observed branch.",
    );
  const available = target >= last;
  return {
    observedRewaterMassCrossingAvailable: available,
    interpolatedDaysToCallerMassThreshold: available
      ? interpolate(
          input.observedPotMassesGrams.map((v) => -v),
          input.observedDaysAfterWatering,
          -target,
        )
      : -1,
    lastObservedPotMassGrams: last,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDaysAfterWatering: [0, 2, 4],
  observedPotMassesGrams: [1000, 900, 700],
  callerIndependentlyEstablishedRewaterMassGrams: 800,
} satisfies Input;
export const exampleOutput = {
  observedRewaterMassCrossingAvailable: true,
  interpolatedDaysToCallerMassThreshold: 3,
  lastObservedPotMassGrams: 700,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/houseplant-watering-interval-lookup",
  title: "Houseplant Watering Interval Lookup",
  description:
    "Read actual drying pot-mass trajectory for independently justified caller rewater threshold, no extrapolation beyond observations; not universal houseplant interval or diagnosing roots/moisture needs.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRewaterMassCrossingAvailable",
      label: "Observed rewater mass crossing available",
      kind: "boolean",
    },
    {
      id: "interpolatedDaysToCallerMassThreshold",
      label: "Interpolated days to caller mass threshold",
      kind: "number",
    },
    {
      id: "lastObservedPotMassGrams",
      label: "Last observed pot mass grams",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDaysAfterWatering:
        value.observedDaysAfterWatering as readonly number[],
      observedPotMassesGrams: value.observedPotMassesGrams as readonly number[],
      callerIndependentlyEstablishedRewaterMassGrams:
        value.callerIndependentlyEstablishedRewaterMassGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
