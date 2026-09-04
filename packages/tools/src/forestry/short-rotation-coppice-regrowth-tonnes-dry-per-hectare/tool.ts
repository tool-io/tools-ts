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
  readonly observedCoppiceFreshTonnes: readonly number[];
  readonly observedDryMassFractions: readonly number[];
  readonly observedHarvestAreasHa: readonly number[];
  readonly observedRegrowthYears: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedDryTonnesHa: number;
  readonly observedDryTonnesPerHaYear: number;
}>;
const inputFields = [
  {
    id: "observedCoppiceFreshTonnes",
    label: "Observed coppice fresh tonnes",
    kind: "numberList",
  },
  {
    id: "observedDryMassFractions",
    label: "Observed dry mass fractions",
    kind: "numberList",
  },
  {
    id: "observedHarvestAreasHa",
    label: "Observed harvest areas ha",
    kind: "numberList",
  },
  {
    id: "observedRegrowthYears",
    label: "Observed regrowth years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedHarvestAreasHa.forEach((v) =>
    positive(v, "observedHarvestAreasHa"),
  );
  input.observedRegrowthYears.forEach((v) =>
    positive(v, "observedRegrowthYears"),
  );
  input.observedCoppiceFreshTonnes.forEach((v) =>
    nonnegative(v, "observedCoppiceFreshTonnes"),
  );
  input.observedDryMassFractions.forEach((v) =>
    fraction(v, "observedDryMassFractions"),
  );
  aligned(
    input.observedCoppiceFreshTonnes,
    input.observedDryMassFractions,
    "observedCoppiceFreshTonnes",
  );
  aligned(
    input.observedCoppiceFreshTonnes,
    input.observedHarvestAreasHa,
    "observedCoppiceFreshTonnes",
  );
  aligned(
    input.observedCoppiceFreshTonnes,
    input.observedRegrowthYears,
    "observedCoppiceFreshTonnes",
  );
  const dry = sum(
    input.observedCoppiceFreshTonnes.map(
      (v, i) => v * input.observedDryMassFractions[i],
    ),
  );
  return {
    observedDryTonnesHa: dry / sum(input.observedHarvestAreasHa),
    observedDryTonnesPerHaYear:
      dry /
      sum(
        input.observedHarvestAreasHa.map(
          (v, i) => v * input.observedRegrowthYears[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCoppiceFreshTonnes: [2, 4],
  observedDryMassFractions: [0.5, 0.25],
  observedHarvestAreasHa: [1, 2],
  observedRegrowthYears: [2, 4],
} satisfies Input;
export const exampleOutput = {
  observedDryTonnesHa: 0.6666666666666666,
  observedDryTonnesPerHaYear: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/short-rotation-coppice-regrowth-tonnes-dry-per-hectare",
  title: "Short Rotation Coppice Dry Tonnes/ha Regrowth",
  description:
    "Audit actual coppice harvest moisture-corrected dry tonnes and area×regrowth-time productivity, not MAI standing volume or harvest forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDryTonnesHa",
      label: "Observed dry tonnes ha",
      kind: "number",
    },
    {
      id: "observedDryTonnesPerHaYear",
      label: "Observed dry tonnes per ha year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCoppiceFreshTonnes:
        value.observedCoppiceFreshTonnes as readonly number[],
      observedDryMassFractions:
        value.observedDryMassFractions as readonly number[],
      observedHarvestAreasHa: value.observedHarvestAreasHa as readonly number[],
      observedRegrowthYears: value.observedRegrowthYears as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
