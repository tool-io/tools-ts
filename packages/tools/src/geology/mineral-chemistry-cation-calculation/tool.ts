import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualOxideWeightAmounts: readonly number[];
  readonly callerVerifiedOxideMolarMasses: readonly number[];
  readonly callerVerifiedCationsPerOxide: readonly number[];
  readonly callerVerifiedOxygensPerOxide: readonly number[];
  readonly callerIndependentNormalizationOxygens: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOxideWeightAmounts",
    label: "Actual oxide weight amounts",
    kind: "numberList",
  },
  {
    id: "callerVerifiedOxideMolarMasses",
    label: "Caller verified oxide molar masses",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCationsPerOxide",
    label: "Caller verified cations per oxide",
    kind: "numberList",
  },
  {
    id: "callerVerifiedOxygensPerOxide",
    label: "Caller verified oxygens per oxide",
    kind: "numberList",
  },
  {
    id: "callerIndependentNormalizationOxygens",
    label: "Caller independent normalization oxygens",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerVerifiedOxideMolarMasses,
    input.callerVerifiedCationsPerOxide,
    input.callerVerifiedOxygensPerOxide,
  ].forEach((v) => aligned(input.actualOxideWeightAmounts, v, "oxides"));
  input.actualOxideWeightAmounts.forEach((v) => nonnegative(v, "weight"));
  input.callerVerifiedOxideMolarMasses.forEach((v) =>
    positive(v, "molar-mass"),
  );
  [
    input.callerVerifiedCationsPerOxide,
    input.callerVerifiedOxygensPerOxide,
  ].forEach((v) => v.forEach((x) => bounded(x, "stoichiometry", 1, 100)));
  positive(input.callerIndependentNormalizationOxygens, "basis");
  const m = input.actualOxideWeightAmounts.map(
    (v, i) => v / input.callerVerifiedOxideMolarMasses[i],
  );
  const o = positive(
    sum(m.map((v, i) => v * input.callerVerifiedOxygensPerOxide[i])),
    "oxygentotal",
  );
  return {
    conditionalOxygenNormalizedCations: m.map(
      (v, i) =>
        (v *
          input.callerVerifiedCationsPerOxide[i] *
          input.callerIndependentNormalizationOxygens) /
        o,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOxideWeightAmounts: [60, 40],
    callerVerifiedOxideMolarMasses: [60, 40],
    callerVerifiedCationsPerOxide: [1, 1],
    callerVerifiedOxygensPerOxide: [2, 1],
    callerIndependentNormalizationOxygens: 6,
  },
  output: { result: { conditionalOxygenNormalizedCations: [2, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/mineral-chemistry-cation-calculation",
  title: "Geology Mineral Chemistry Cation Calculation Calculator",
  description:
    "Actual mineral oxide-to-cation oxygen-basis normalization with caller independently verified oxide stoichiometry/molar masses and mineral oxygen basis. Not infer valence, site occupancy, Feoxidation, volatile deficits or mineral classification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
