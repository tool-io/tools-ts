import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  aligned,
  sum,
  catalog,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFittingIds: readonly string[];
  readonly callerMatchedEquivalentLengthsM: readonly number[];
  readonly observedFittingIds: readonly string[];
  readonly observedFittingMultiplicity: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerEquivalentFittingLengthsM: readonly number[];
  readonly totalCallerEquivalentFittingLengthM: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFittingIds",
    label: "Caller verified fitting ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedEquivalentLengthsM",
    label: "Caller matched equivalent lengths m",
    kind: "numberList",
  },
  {
    id: "observedFittingIds",
    label: "Observed fitting ids",
    kind: "stringList",
  },
  {
    id: "observedFittingMultiplicity",
    label: "Observed fitting multiplicity",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedEquivalentLengthsM.forEach((v) =>
    nonnegative(v, "callerMatchedEquivalentLengthsM"),
  );
  aligned(
    input.observedFittingIds,
    input.observedFittingMultiplicity,
    "observedFittingIds",
  );
  const lengths = input.observedFittingIds.map((v, i) => {
    bounded(input.observedFittingMultiplicity[i], "count", 0, 1000000);
    return (
      catalog(
        input.callerVerifiedFittingIds,
        input.callerMatchedEquivalentLengthsM,
        v,
      ) * input.observedFittingMultiplicity[i]
    );
  });
  return {
    callerEquivalentFittingLengthsM: lengths,
    totalCallerEquivalentFittingLengthM: sum(lengths),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFittingIds: ["elbow", "tee"],
  callerMatchedEquivalentLengthsM: [1, 2],
  observedFittingIds: ["tee", "elbow"],
  observedFittingMultiplicity: [2, 3],
} satisfies Input;
export const exampleOutput = {
  callerEquivalentFittingLengthsM: [4, 3],
  totalCallerEquivalentFittingLengthM: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/equivalent-length-fitting",
  title: "Plumbing Equivalent Length Fitting Calculator",
  description:
    "Inventory actual fitting IDs/multiplicity against independently verified matched-diameter equivalent lengths; not universal elbow table or K/velocity loss calculator.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerEquivalentFittingLengthsM",
      label: "Caller equivalent fitting lengths m",
      kind: "numberList",
    },
    {
      id: "totalCallerEquivalentFittingLengthM",
      label: "Total caller equivalent fitting length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedFittingIds:
        value.callerVerifiedFittingIds as readonly string[],
      callerMatchedEquivalentLengthsM:
        value.callerMatchedEquivalentLengthsM as readonly number[],
      observedFittingIds: value.observedFittingIds as readonly string[],
      observedFittingMultiplicity:
        value.observedFittingMultiplicity as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
