import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRiderMassKg: readonly number[];
  readonly observedMatchedPowerWatts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPowerWattsPerRiderKg: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRiderMassKg",
    label: "Observed rider mass kg",
    kind: "numberList",
  },
  {
    id: "observedMatchedPowerWatts",
    label: "Observed matched power watts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRiderMassKg.forEach((v) => positive(v, "observedRiderMassKg"));
  input.observedMatchedPowerWatts.forEach((v) =>
    nonnegative(v, "observedMatchedPowerWatts"),
  );
  aligned(
    input.observedRiderMassKg,
    input.observedMatchedPowerWatts,
    "observedRiderMassKg",
  );
  return {
    observedPowerWattsPerRiderKg: input.observedMatchedPowerWatts.map(
      (v, i) => v / input.observedRiderMassKg[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRiderMassKg: [60, 80],
  observedMatchedPowerWatts: [240, 240],
} satisfies Input;
export const exampleOutput = {
  observedPowerWattsPerRiderKg: [4, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/power-to-weight-ratio-wkg",
  title: "Power-to-Weight Ratio W/kg Calculator",
  description:
    "Normalize matched actual cycling power to rider mass only, keeping distinct observations; not total-system climbing model, weight-loss target or fitness certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPowerWattsPerRiderKg",
      label: "Observed power watts per rider kg",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRiderMassKg: value.observedRiderMassKg as readonly number[],
      observedMatchedPowerWatts:
        value.observedMatchedPowerWatts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
