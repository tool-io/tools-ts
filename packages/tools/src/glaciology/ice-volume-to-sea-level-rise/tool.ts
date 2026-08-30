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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly iceVolumesM3: readonly number[];
  readonly subSeaLevelBedCavityVolumesM3: readonly number[];
  readonly contributingGroundedFractions: readonly number[];
  readonly iceDensityKgPerM3: number;
  readonly referenceWaterDensityKgPerM3: number;
  readonly oceanAreaM2: number;
}>;
export type Output = Readonly<{
  readonly netSeaLevelEquivalentWaterVolumeM3: number;
  readonly seaLevelEquivalentRiseM: number;
}>;
const inputFields = [
  { id: "iceVolumesM3", label: "Ice volumes m3", kind: "numberList" },
  {
    id: "subSeaLevelBedCavityVolumesM3",
    label: "Sub sea level bed cavity volumes m3",
    kind: "numberList",
  },
  {
    id: "contributingGroundedFractions",
    label: "Contributing grounded fractions",
    kind: "numberList",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "referenceWaterDensityKgPerM3",
    label: "Reference water density kg per m3",
    kind: "number",
  },
  { id: "oceanAreaM2", label: "Ocean area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.referenceWaterDensityKgPerM3, "referenceWaterDensityKgPerM3");
  positive(input.oceanAreaM2, "oceanAreaM2");
  input.iceVolumesM3.forEach((v) => nonnegative(v, "iceVolumesM3"));
  input.subSeaLevelBedCavityVolumesM3.forEach((v) =>
    nonnegative(v, "subSeaLevelBedCavityVolumesM3"),
  );
  input.contributingGroundedFractions.forEach((v) =>
    fraction(v, "contributingGroundedFractions"),
  );
  aligned(
    input.iceVolumesM3,
    input.subSeaLevelBedCavityVolumesM3,
    "iceVolumesM3",
  );
  aligned(
    input.iceVolumesM3,
    input.contributingGroundedFractions,
    "iceVolumesM3",
  );
  const netSeaLevelEquivalentWaterVolumeM3 = input.iceVolumesM3.reduce(
    (s, v, i) => {
      if (input.subSeaLevelBedCavityVolumesM3[i] > v)
        simpleError(
          "subSeaLevelBedCavityVolumesM3",
          "Bed cavity volume cannot exceed matched ice column volume.",
        );
      return (
        s +
        input.contributingGroundedFractions[i] *
          ((v * input.iceDensityKgPerM3) / input.referenceWaterDensityKgPerM3 -
            input.subSeaLevelBedCavityVolumesM3[i])
      );
    },
    0,
  );
  return {
    netSeaLevelEquivalentWaterVolumeM3,
    seaLevelEquivalentRiseM:
      netSeaLevelEquivalentWaterVolumeM3 / input.oceanAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceVolumesM3: [1000],
  subSeaLevelBedCavityVolumesM3: [100],
  contributingGroundedFractions: [1],
  iceDensityKgPerM3: 900,
  referenceWaterDensityKgPerM3: 1000,
  oceanAreaM2: 1000000,
} satisfies Input;
export const exampleOutput = {
  netSeaLevelEquivalentWaterVolumeM3: 800,
  seaLevelEquivalentRiseM: 0.0008,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ice-volume-to-sea-level-rise",
  title: "Ice Volume to Sea Level Rise",
  description:
    "Estimate grounded-ice sea-level equivalent after filling released sub-sea-level bed cavities; excludes floating ice, seawater salinity dilution, ocean area changes and gravitational fingerprints.",
  inputs: inputFields,
  outputs: [
    {
      id: "netSeaLevelEquivalentWaterVolumeM3",
      label: "Net sea level equivalent water volume m3",
      kind: "number",
    },
    {
      id: "seaLevelEquivalentRiseM",
      label: "Sea level equivalent rise m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      iceVolumesM3: value.iceVolumesM3 as readonly number[],
      subSeaLevelBedCavityVolumesM3:
        value.subSeaLevelBedCavityVolumesM3 as readonly number[],
      contributingGroundedFractions:
        value.contributingGroundedFractions as readonly number[],
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      referenceWaterDensityKgPerM3:
        value.referenceWaterDensityKgPerM3 as number,
      oceanAreaM2: value.oceanAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
