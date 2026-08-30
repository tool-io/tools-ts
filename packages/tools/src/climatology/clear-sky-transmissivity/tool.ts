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
  readonly measuredClearSkyRadiationMjPerM2: readonly number[];
  readonly correspondingExtraterrestrialRadiationMjPerM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedClearSkyTransmissivities: readonly number[];
  readonly energyWeightedClearSkyTransmissivity: number;
}>;
const inputFields = [
  {
    id: "measuredClearSkyRadiationMjPerM2",
    label: "Measured clear sky radiation mj per m2",
    kind: "numberList",
  },
  {
    id: "correspondingExtraterrestrialRadiationMjPerM2",
    label: "Corresponding extraterrestrial radiation mj per m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.correspondingExtraterrestrialRadiationMjPerM2.forEach((v) =>
    positive(v, "correspondingExtraterrestrialRadiationMjPerM2"),
  );
  input.measuredClearSkyRadiationMjPerM2.forEach((v) =>
    nonnegative(v, "measuredClearSkyRadiationMjPerM2"),
  );
  aligned(
    input.measuredClearSkyRadiationMjPerM2,
    input.correspondingExtraterrestrialRadiationMjPerM2,
    "measuredClearSkyRadiationMjPerM2",
  );
  const observedClearSkyTransmissivities =
    input.measuredClearSkyRadiationMjPerM2.map((v, i) =>
      fraction(
        v / input.correspondingExtraterrestrialRadiationMjPerM2[i],
        "transmissivity",
      ),
    );
  return {
    observedClearSkyTransmissivities,
    energyWeightedClearSkyTransmissivity:
      input.measuredClearSkyRadiationMjPerM2.reduce((a, b) => a + b, 0) /
      input.correspondingExtraterrestrialRadiationMjPerM2.reduce(
        (a, b) => a + b,
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredClearSkyRadiationMjPerM2: [10, 20],
  correspondingExtraterrestrialRadiationMjPerM2: [20, 40],
} satisfies Input;
export const exampleOutput = {
  observedClearSkyTransmissivities: [0.5, 0.5],
  energyWeightedClearSkyTransmissivity: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/clear-sky-transmissivity",
  title: "Clear Sky Transmissivity Estimate",
  description:
    "Estimate observed clear-sky bulk transmissivity from paired integrated surface/extraterrestrial energies; observations must be independently identified clear-sky, not assumed clear from station elevation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedClearSkyTransmissivities",
      label: "Observed clear sky transmissivities",
      kind: "numberList",
    },
    {
      id: "energyWeightedClearSkyTransmissivity",
      label: "Energy weighted clear sky transmissivity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredClearSkyRadiationMjPerM2:
        value.measuredClearSkyRadiationMjPerM2 as readonly number[],
      correspondingExtraterrestrialRadiationMjPerM2:
        value.correspondingExtraterrestrialRadiationMjPerM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
