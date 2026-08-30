import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly chamberFluxesGramsPerM2Day: readonly number[];
  readonly representedPatchAreasM2: readonly number[];
  readonly backgroundFluxesGramsPerM2Day: readonly number[];
}>;
export type Output = Readonly<{
  readonly areaWeightedNetFluxGramsPerM2Day: number;
  readonly representedNetCo2KgPerDay: number;
}>;
const inputFields = [
  {
    id: "chamberFluxesGramsPerM2Day",
    label: "Chamber fluxes grams per m2 day",
    kind: "numberList",
  },
  {
    id: "representedPatchAreasM2",
    label: "Represented patch areas m2",
    kind: "numberList",
  },
  {
    id: "backgroundFluxesGramsPerM2Day",
    label: "Background fluxes grams per m2 day",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedPatchAreasM2.forEach((v) =>
    positive(v, "representedPatchAreasM2"),
  );
  aligned(
    input.chamberFluxesGramsPerM2Day,
    input.representedPatchAreasM2,
    "chamberFluxesGramsPerM2Day",
  );
  aligned(
    input.chamberFluxesGramsPerM2Day,
    input.backgroundFluxesGramsPerM2Day,
    "chamberFluxesGramsPerM2Day",
  );
  const area = input.representedPatchAreasM2.reduce((a, b) => a + b, 0),
    mass = input.chamberFluxesGramsPerM2Day.reduce(
      (s, v, i) =>
        s +
        (v - input.backgroundFluxesGramsPerM2Day[i]) *
          input.representedPatchAreasM2[i],
      0,
    );
  return {
    areaWeightedNetFluxGramsPerM2Day: mass / area,
    representedNetCo2KgPerDay: mass / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  chamberFluxesGramsPerM2Day: [10, -2],
  representedPatchAreasM2: [2, 3],
  backgroundFluxesGramsPerM2Day: [1, 1],
} satisfies Input;
export const exampleOutput = {
  areaWeightedNetFluxGramsPerM2Day: 1.8,
  representedNetCo2KgPerDay: 0.009,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/diffuse-co2-soil-flux-average",
  title: "Diffuse CO2 Soil Flux Average",
  description:
    "Aggregate patch-representative blank/background-corrected diffuse soil CO2 fluxes with physical area weights; signed uptake/nondetections are retained and unmeasured area is not interpolated.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedNetFluxGramsPerM2Day",
      label: "Area weighted net flux grams per m2 day",
      kind: "number",
    },
    {
      id: "representedNetCo2KgPerDay",
      label: "Represented net co2 kg per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      chamberFluxesGramsPerM2Day:
        value.chamberFluxesGramsPerM2Day as readonly number[],
      representedPatchAreasM2:
        value.representedPatchAreasM2 as readonly number[],
      backgroundFluxesGramsPerM2Day:
        value.backgroundFluxesGramsPerM2Day as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
