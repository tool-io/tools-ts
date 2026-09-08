import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedUnequalizedAssessedValuesMinor: readonly number[];
  readonly callerCountyFactorNumerators: readonly number[];
  readonly callerCountyFactorDenominators: readonly number[];
}>;
export type Output = Readonly<{
  readonly conditionalEqualizedValuesMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "observedUnequalizedAssessedValuesMinor",
    label: "Observed unequalized assessed values minor",
    kind: "numberList",
  },
  {
    id: "callerCountyFactorNumerators",
    label: "Caller county factor numerators",
    kind: "numberList",
  },
  {
    id: "callerCountyFactorDenominators",
    label: "Caller county factor denominators",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedUnequalizedAssessedValuesMinor.forEach((v) =>
    money(v, "observedUnequalizedAssessedValuesMinor"),
  );
  aligned(
    input.observedUnequalizedAssessedValuesMinor,
    input.callerCountyFactorNumerators,
    "observedUnequalizedAssessedValuesMinor",
  );
  aligned(
    input.observedUnequalizedAssessedValuesMinor,
    input.callerCountyFactorDenominators,
    "observedUnequalizedAssessedValuesMinor",
  );
  input.callerCountyFactorNumerators.forEach((v) =>
    bounded(v, "numerator", 1, 1000000),
  );
  input.callerCountyFactorDenominators.forEach((v) =>
    bounded(v, "denominator", 1, 1000000),
  );
  return {
    conditionalEqualizedValuesMinor:
      input.observedUnequalizedAssessedValuesMinor.map((v, i) =>
        roundMinor(
          BigInt(v) * BigInt(input.callerCountyFactorNumerators[i]),
          BigInt(input.callerCountyFactorDenominators[i]),
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUnequalizedAssessedValuesMinor: [100, 200],
  callerCountyFactorNumerators: [11, 9],
  callerCountyFactorDenominators: [10, 10],
} satisfies Input;
export const exampleOutput = {
  conditionalEqualizedValuesMinor: [110, 180],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/equalization-factor-intercounty-adjuster",
  title: "Equalization Factor Intercounty Adjuster",
  description:
    "Matched county-specific exact equalization factors applied to actual assessed values, unlike assessment market-value ratio; independent factor applicability. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalEqualizedValuesMinor",
      label: "Conditional equalized values minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUnequalizedAssessedValuesMinor:
        value.observedUnequalizedAssessedValuesMinor as readonly number[],
      callerCountyFactorNumerators:
        value.callerCountyFactorNumerators as readonly number[],
      callerCountyFactorDenominators:
        value.callerCountyFactorDenominators as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
