import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly pairedInitialWeightsKg: readonly number[];
  readonly pairedFinalWeightsKg: readonly number[];
  readonly elapsedDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedDailyWeightGainsKgPerDay: readonly number[];
  readonly exposurePooledWeightGainKgPerAnimalDay: number;
}>;
const inputFields = [
  {
    id: "pairedInitialWeightsKg",
    label: "Paired initial weights kg",
    kind: "numberList",
  },
  {
    id: "pairedFinalWeightsKg",
    label: "Paired final weights kg",
    kind: "numberList",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pairedInitialWeightsKg.forEach((v) =>
    positive(v, "pairedInitialWeightsKg"),
  );
  input.pairedFinalWeightsKg.forEach((v) =>
    positive(v, "pairedFinalWeightsKg"),
  );
  input.elapsedDays.forEach((v) => positive(v, "elapsedDays"));
  aligned(
    input.pairedInitialWeightsKg,
    input.pairedFinalWeightsKg,
    "pairedInitialWeightsKg",
  );
  aligned(
    input.pairedInitialWeightsKg,
    input.elapsedDays,
    "pairedInitialWeightsKg",
  );
  return {
    pairedDailyWeightGainsKgPerDay: input.pairedInitialWeightsKg.map(
      (v, i) => (input.pairedFinalWeightsKg[i] - v) / input.elapsedDays[i],
    ),
    exposurePooledWeightGainKgPerAnimalDay:
      input.pairedInitialWeightsKg.reduce(
        (s, v, i) => s + input.pairedFinalWeightsKg[i] - v,
        0,
      ) / input.elapsedDays.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pairedInitialWeightsKg: [100, 200],
  pairedFinalWeightsKg: [110, 195],
  elapsedDays: [10, 5],
} satisfies Input;
export const exampleOutput = {
  pairedDailyWeightGainsKgPerDay: [1, -1],
  exposurePooledWeightGainKgPerAnimalDay: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/daily-weight-gain",
  title: "Agriculture Daily Weight Gain",
  description:
    "Retain signed paired animal weight changes normalized by actual observation days and pooled animal-day exposure; no growth, nutrition or health diagnosis from apparent weight change.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedDailyWeightGainsKgPerDay",
      label: "Paired daily weight gains kg per day",
      kind: "numberList",
    },
    {
      id: "exposurePooledWeightGainKgPerAnimalDay",
      label: "Exposure pooled weight gain kg per animal day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pairedInitialWeightsKg: value.pairedInitialWeightsKg as readonly number[],
      pairedFinalWeightsKg: value.pairedFinalWeightsKg as readonly number[],
      elapsedDays: value.elapsedDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
