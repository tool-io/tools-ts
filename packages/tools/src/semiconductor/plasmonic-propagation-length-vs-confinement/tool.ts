import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPlasmonConfinementFractions: readonly number[];
  readonly observedMatchedPropagationLengthsM: readonly number[];
  readonly callerMinimumConfinementFraction: number;
  readonly callerMinimumPropagationLengthM: number;
}>;
export type Output = Readonly<{
  readonly measuredSamplesMeetingBothCriteria: readonly number[];
  readonly observedConfinementLengthProductsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPlasmonConfinementFractions",
    label: "Observed plasmon confinement fractions",
    kind: "numberList",
  },
  {
    id: "observedMatchedPropagationLengthsM",
    label: "Observed matched propagation lengths m",
    kind: "numberList",
  },
  {
    id: "callerMinimumConfinementFraction",
    label: "Caller minimum confinement fraction",
    kind: "number",
  },
  {
    id: "callerMinimumPropagationLengthM",
    label: "Caller minimum propagation length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedPropagationLengthsM.forEach((v) =>
    positive(v, "observedMatchedPropagationLengthsM"),
  );
  nonnegative(
    input.callerMinimumPropagationLengthM,
    "callerMinimumPropagationLengthM",
  );
  input.observedPlasmonConfinementFractions.forEach((v) =>
    fraction(v, "observedPlasmonConfinementFractions"),
  );
  fraction(
    input.callerMinimumConfinementFraction,
    "callerMinimumConfinementFraction",
  );
  aligned(
    input.observedPlasmonConfinementFractions,
    input.observedMatchedPropagationLengthsM,
    "observedPlasmonConfinementFractions",
  );
  return {
    measuredSamplesMeetingBothCriteria:
      input.observedPlasmonConfinementFractions.flatMap((v, i) =>
        v >= input.callerMinimumConfinementFraction &&
        input.observedMatchedPropagationLengthsM[i] >=
          input.callerMinimumPropagationLengthM
          ? [i]
          : [],
      ),
    observedConfinementLengthProductsM:
      input.observedPlasmonConfinementFractions.map(
        (v, i) => v * input.observedMatchedPropagationLengthsM[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlasmonConfinementFractions: [0.1, 0.3, 0.5],
  observedMatchedPropagationLengthsM: [10, 6, 2],
  callerMinimumConfinementFraction: 0.2,
  callerMinimumPropagationLengthM: 5,
} satisfies Input;
export const exampleOutput = {
  measuredSamplesMeetingBothCriteria: [1],
  observedConfinementLengthProductsM: [1, 1.8, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/plasmonic-propagation-length-vs-confinement",
  title: "Semiconductor Plasmonic Propagation Length Vs Confinement Calculator",
  description:
    "Audit actual matched plasmon confinement/propagation Pareto evidence against two caller criteria, not independent length exponential fit or a universal tradeoff.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredSamplesMeetingBothCriteria",
      label: "Measured samples meeting both criteria",
      kind: "numberList",
    },
    {
      id: "observedConfinementLengthProductsM",
      label: "Observed confinement length products m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlasmonConfinementFractions:
        value.observedPlasmonConfinementFractions as readonly number[],
      observedMatchedPropagationLengthsM:
        value.observedMatchedPropagationLengthsM as readonly number[],
      callerMinimumConfinementFraction:
        value.callerMinimumConfinementFraction as number,
      callerMinimumPropagationLengthM:
        value.callerMinimumPropagationLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
