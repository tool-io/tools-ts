import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly currentStandingVolumeM3PerHa: number;
  readonly cumulativeRemovedVolumeM3PerHa: number;
  readonly cumulativeMortalityVolumeM3PerHa: number;
  readonly standAgeYears: number;
  readonly referenceAnnualProductionM3PerHa: number;
}>;
export type Output = Readonly<{
  readonly accountedAnnualBiologicalProductionM3PerHa: number;
  readonly relativeSiteProductivityIndex: number;
}>;
const inputFields = [
  {
    id: "currentStandingVolumeM3PerHa",
    label: "Current standing volume m3 per ha",
    kind: "number",
  },
  {
    id: "cumulativeRemovedVolumeM3PerHa",
    label: "Cumulative removed volume m3 per ha",
    kind: "number",
  },
  {
    id: "cumulativeMortalityVolumeM3PerHa",
    label: "Cumulative mortality volume m3 per ha",
    kind: "number",
  },
  { id: "standAgeYears", label: "Stand age years", kind: "number" },
  {
    id: "referenceAnnualProductionM3PerHa",
    label: "Reference annual production m3 per ha",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.standAgeYears, "standAgeYears");
  positive(
    input.referenceAnnualProductionM3PerHa,
    "referenceAnnualProductionM3PerHa",
  );
  nonnegative(
    input.currentStandingVolumeM3PerHa,
    "currentStandingVolumeM3PerHa",
  );
  nonnegative(
    input.cumulativeRemovedVolumeM3PerHa,
    "cumulativeRemovedVolumeM3PerHa",
  );
  nonnegative(
    input.cumulativeMortalityVolumeM3PerHa,
    "cumulativeMortalityVolumeM3PerHa",
  );
  const accountedAnnualBiologicalProductionM3PerHa =
    (input.currentStandingVolumeM3PerHa +
      input.cumulativeRemovedVolumeM3PerHa +
      input.cumulativeMortalityVolumeM3PerHa) /
    input.standAgeYears;
  return {
    accountedAnnualBiologicalProductionM3PerHa,
    relativeSiteProductivityIndex:
      accountedAnnualBiologicalProductionM3PerHa /
      input.referenceAnnualProductionM3PerHa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentStandingVolumeM3PerHa: 100,
  cumulativeRemovedVolumeM3PerHa: 30,
  cumulativeMortalityVolumeM3PerHa: 20,
  standAgeYears: 10,
  referenceAnnualProductionM3PerHa: 10,
} satisfies Input;
export const exampleOutput = {
  accountedAnnualBiologicalProductionM3PerHa: 15,
  relativeSiteProductivityIndex: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/site-productivity-index",
  title: "Site Productivity Index",
  description:
    "Compare accounted standing+removed+mortality production to a caller age/area-compatible reference; unlike standing-volume MAI, removals and mortality are included, with no universal yield class.",
  inputs: inputFields,
  outputs: [
    {
      id: "accountedAnnualBiologicalProductionM3PerHa",
      label: "Accounted annual biological production m3 per ha",
      kind: "number",
    },
    {
      id: "relativeSiteProductivityIndex",
      label: "Relative site productivity index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      currentStandingVolumeM3PerHa:
        value.currentStandingVolumeM3PerHa as number,
      cumulativeRemovedVolumeM3PerHa:
        value.cumulativeRemovedVolumeM3PerHa as number,
      cumulativeMortalityVolumeM3PerHa:
        value.cumulativeMortalityVolumeM3PerHa as number,
      standAgeYears: value.standAgeYears as number,
      referenceAnnualProductionM3PerHa:
        value.referenceAnnualProductionM3PerHa as number,
    }),
});
export const run = tool.execute;
export default tool;
