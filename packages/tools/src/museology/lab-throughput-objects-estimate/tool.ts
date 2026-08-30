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
  fraction,
  count,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly availableAnnualProductiveHours: number;
  readonly callerHoursPerObjectByClass: readonly number[];
  readonly plannedClassMixFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly mixMeanHoursPerObject: number;
  readonly modeledCompleteObjectsAnnualThroughput: number;
  readonly unusedProductiveHours: number;
}>;
const inputFields = [
  {
    id: "availableAnnualProductiveHours",
    label: "Available annual productive hours",
    kind: "number",
  },
  {
    id: "callerHoursPerObjectByClass",
    label: "Caller hours per object by class",
    kind: "numberList",
  },
  {
    id: "plannedClassMixFractions",
    label: "Planned class mix fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerHoursPerObjectByClass.forEach((v) =>
    positive(v, "callerHoursPerObjectByClass"),
  );
  nonnegative(
    input.availableAnnualProductiveHours,
    "availableAnnualProductiveHours",
  );
  input.plannedClassMixFractions.forEach((v) =>
    fraction(v, "plannedClassMixFractions"),
  );
  aligned(
    input.callerHoursPerObjectByClass,
    input.plannedClassMixFractions,
    "callerHoursPerObjectByClass",
  );
  if (Math.abs(sum(input.plannedClassMixFractions) - 1) > 1e-12)
    simpleError("mix", "Caller class mix must sum to one.");
  const h = positive(
      input.callerHoursPerObjectByClass.reduce(
        (s, v, i) => s + v * input.plannedClassMixFractions[i],
        0,
      ),
      "meanHours",
    ),
    n = count(Math.floor(input.availableAnnualProductiveHours / h), "objects");
  return {
    mixMeanHoursPerObject: h,
    modeledCompleteObjectsAnnualThroughput: n,
    unusedProductiveHours: input.availableAnnualProductiveHours - n * h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  availableAnnualProductiveHours: 100,
  callerHoursPerObjectByClass: [10, 20],
  plannedClassMixFractions: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  mixMeanHoursPerObject: 15,
  modeledCompleteObjectsAnnualThroughput: 6,
  unusedProductiveHours: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/lab-throughput-objects-estimate",
  title: "Conservation Lab Annual Throughput Objects Estimate Calculator",
  description:
    "Budget expected complete lab objects using caller productive hours and explicit complexity mix, not universal conservator-hour multipliers or a guaranteed integer mix allocation.",
  inputs: inputFields,
  outputs: [
    {
      id: "mixMeanHoursPerObject",
      label: "Mix mean hours per object",
      kind: "number",
    },
    {
      id: "modeledCompleteObjectsAnnualThroughput",
      label: "Modeled complete objects annual throughput",
      kind: "number",
    },
    {
      id: "unusedProductiveHours",
      label: "Unused productive hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      availableAnnualProductiveHours:
        value.availableAnnualProductiveHours as number,
      callerHoursPerObjectByClass:
        value.callerHoursPerObjectByClass as readonly number[],
      plannedClassMixFractions:
        value.plannedClassMixFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
