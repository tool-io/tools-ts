import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedIonMgLiter: readonly number[];
  readonly callerIonEquivalentWeightMgPerMilliequivalent: readonly number[];
  readonly callerCaco3EquivalentWeight: number;
}>;
export type Output = Readonly<{
  readonly observedHardnessContributionsMgCaco3Liter: readonly number[];
  readonly totalObservedHardnessMgCaco3Liter: number;
}>;
const inputFields = [
  {
    id: "observedIonMgLiter",
    label: "Observed ion mg liter",
    kind: "numberList",
  },
  {
    id: "callerIonEquivalentWeightMgPerMilliequivalent",
    label: "Caller ion equivalent weight mg per milliequivalent",
    kind: "numberList",
  },
  {
    id: "callerCaco3EquivalentWeight",
    label: "Caller caco3 equivalent weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIonEquivalentWeightMgPerMilliequivalent.forEach((v) =>
    positive(v, "callerIonEquivalentWeightMgPerMilliequivalent"),
  );
  positive(input.callerCaco3EquivalentWeight, "callerCaco3EquivalentWeight");
  input.observedIonMgLiter.forEach((v) => nonnegative(v, "observedIonMgLiter"));
  aligned(
    input.observedIonMgLiter,
    input.callerIonEquivalentWeightMgPerMilliequivalent,
    "observedIonMgLiter",
  );
  const contributions = input.observedIonMgLiter.map(
    (v, i) =>
      (v / input.callerIonEquivalentWeightMgPerMilliequivalent[i]) *
      input.callerCaco3EquivalentWeight,
  );
  return {
    observedHardnessContributionsMgCaco3Liter: contributions,
    totalObservedHardnessMgCaco3Liter: sum(contributions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIonMgLiter: [20, 10],
  callerIonEquivalentWeightMgPerMilliequivalent: [20, 12.5],
  callerCaco3EquivalentWeight: 50,
} satisfies Input;
export const exampleOutput = {
  observedHardnessContributionsMgCaco3Liter: [50, 40],
  totalObservedHardnessMgCaco3Liter: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-hardness-as-caco3",
  title: "Plumbing Water Hardness As Caco3 Calculator",
  description:
    "Convert actual independent hardness-ion assays via caller verified equivalent weights into CaCO3-equivalent contributions; not mass sum, default ion identity or water quality diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedHardnessContributionsMgCaco3Liter",
      label: "Observed hardness contributions mg caco3 liter",
      kind: "numberList",
    },
    {
      id: "totalObservedHardnessMgCaco3Liter",
      label: "Total observed hardness mg caco3 liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIonMgLiter: value.observedIonMgLiter as readonly number[],
      callerIonEquivalentWeightMgPerMilliequivalent:
        value.callerIonEquivalentWeightMgPerMilliequivalent as readonly number[],
      callerCaco3EquivalentWeight: value.callerCaco3EquivalentWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
