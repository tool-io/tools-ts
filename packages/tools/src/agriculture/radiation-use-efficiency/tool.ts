import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly prePeriodDryBiomassGramsPerM2: number;
  readonly postPeriodDryBiomassGramsPerM2: number;
  readonly intervalIncidentParMjPerM2: readonly number[];
  readonly interceptedParFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalInterceptedParMjPerM2: number;
  readonly signedDryBiomassGainGramsPerM2: number;
  readonly observedRadiationUseEfficiencyGramsPerMj: number;
}>;
const inputFields = [
  {
    id: "prePeriodDryBiomassGramsPerM2",
    label: "Pre period dry biomass grams per m2",
    kind: "number",
  },
  {
    id: "postPeriodDryBiomassGramsPerM2",
    label: "Post period dry biomass grams per m2",
    kind: "number",
  },
  {
    id: "intervalIncidentParMjPerM2",
    label: "Interval incident par mj per m2",
    kind: "numberList",
  },
  {
    id: "interceptedParFractions",
    label: "Intercepted par fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.prePeriodDryBiomassGramsPerM2,
    "prePeriodDryBiomassGramsPerM2",
  );
  nonnegative(
    input.postPeriodDryBiomassGramsPerM2,
    "postPeriodDryBiomassGramsPerM2",
  );
  input.intervalIncidentParMjPerM2.forEach((v) =>
    nonnegative(v, "intervalIncidentParMjPerM2"),
  );
  input.interceptedParFractions.forEach((v) =>
    fraction(v, "interceptedParFractions"),
  );
  aligned(
    input.intervalIncidentParMjPerM2,
    input.interceptedParFractions,
    "intervalIncidentParMjPerM2",
  );
  const totalInterceptedParMjPerM2 = positive(
      input.intervalIncidentParMjPerM2.reduce(
        (s, v, i) => s + v * input.interceptedParFractions[i],
        0,
      ),
      "interceptedPar",
    ),
    signedDryBiomassGainGramsPerM2 =
      input.postPeriodDryBiomassGramsPerM2 -
      input.prePeriodDryBiomassGramsPerM2;
  return {
    totalInterceptedParMjPerM2,
    signedDryBiomassGainGramsPerM2,
    observedRadiationUseEfficiencyGramsPerMj:
      signedDryBiomassGainGramsPerM2 / totalInterceptedParMjPerM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  prePeriodDryBiomassGramsPerM2: 100,
  postPeriodDryBiomassGramsPerM2: 300,
  intervalIncidentParMjPerM2: [10, 20],
  interceptedParFractions: [0.5, 0.75],
} satisfies Input;
export const exampleOutput = {
  totalInterceptedParMjPerM2: 20,
  signedDryBiomassGainGramsPerM2: 200,
  observedRadiationUseEfficiencyGramsPerMj: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/radiation-use-efficiency",
  title: "Agriculture Radiation Use Efficiency",
  description:
    "Normalize observed signed dry-biomass change by integrated intercepted PAR, not total incident solar energy or point PPFD; allocation/respiration changes and causal light response are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalInterceptedParMjPerM2",
      label: "Total intercepted par mj per m2",
      kind: "number",
    },
    {
      id: "signedDryBiomassGainGramsPerM2",
      label: "Signed dry biomass gain grams per m2",
      kind: "number",
    },
    {
      id: "observedRadiationUseEfficiencyGramsPerMj",
      label: "Observed radiation use efficiency grams per mj",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      prePeriodDryBiomassGramsPerM2:
        value.prePeriodDryBiomassGramsPerM2 as number,
      postPeriodDryBiomassGramsPerM2:
        value.postPeriodDryBiomassGramsPerM2 as number,
      intervalIncidentParMjPerM2:
        value.intervalIncidentParMjPerM2 as readonly number[],
      interceptedParFractions:
        value.interceptedParFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
