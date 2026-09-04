import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyAppliedProductKg: readonly number[];
  readonly callerVerifiedActiveMassFractions: readonly number[];
  readonly observedTreatedAreasHa: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedAppliedActiveKg: number;
  readonly pooledObservedActiveKgHa: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyAppliedProductKg",
    label: "Observed already applied product kg",
    kind: "numberList",
  },
  {
    id: "callerVerifiedActiveMassFractions",
    label: "Caller verified active mass fractions",
    kind: "numberList",
  },
  {
    id: "observedTreatedAreasHa",
    label: "Observed treated areas ha",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTreatedAreasHa.forEach((v) =>
    positive(v, "observedTreatedAreasHa"),
  );
  input.observedAlreadyAppliedProductKg.forEach((v) =>
    nonnegative(v, "observedAlreadyAppliedProductKg"),
  );
  input.callerVerifiedActiveMassFractions.forEach((v) =>
    fraction(v, "callerVerifiedActiveMassFractions"),
  );
  aligned(
    input.observedAlreadyAppliedProductKg,
    input.callerVerifiedActiveMassFractions,
    "observedAlreadyAppliedProductKg",
  );
  aligned(
    input.observedAlreadyAppliedProductKg,
    input.observedTreatedAreasHa,
    "observedAlreadyAppliedProductKg",
  );
  const active = sum(
    input.observedAlreadyAppliedProductKg.map(
      (v, i) => v * input.callerVerifiedActiveMassFractions[i],
    ),
  );
  return {
    observedAppliedActiveKg: active,
    pooledObservedActiveKgHa: active / sum(input.observedTreatedAreasHa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyAppliedProductKg: [2, 3],
  callerVerifiedActiveMassFractions: [0.5, 0.2],
  observedTreatedAreasHa: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedAppliedActiveKg: 1.6,
  pooledObservedActiveKgHa: 0.5333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/herbicide-active-ingredient-kg-per-hectare",
  title: "Herbicide Active Ingredient kg/ha Calculator",
  description:
    "Audit already applied herbicide product inventory and independently verified active fractions/treated areas only, no recommended dose, mixing recipe, label permission or exposure safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAppliedActiveKg",
      label: "Observed applied active kg",
      kind: "number",
    },
    {
      id: "pooledObservedActiveKgHa",
      label: "Pooled observed active kg ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyAppliedProductKg:
        value.observedAlreadyAppliedProductKg as readonly number[],
      callerVerifiedActiveMassFractions:
        value.callerVerifiedActiveMassFractions as readonly number[],
      observedTreatedAreasHa: value.observedTreatedAreasHa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
