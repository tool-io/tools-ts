import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly coreDryMassesGrams: readonly number[];
  readonly coreAshMassesGrams: readonly number[];
  readonly sampledCoreAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly ashFreeFloorDryMassKgPerM2: number;
  readonly ashFreeFloorDryBiomassTonnesPerHa: number;
}>;
const inputFields = [
  {
    id: "coreDryMassesGrams",
    label: "Core dry masses grams",
    kind: "numberList",
  },
  {
    id: "coreAshMassesGrams",
    label: "Core ash masses grams",
    kind: "numberList",
  },
  {
    id: "sampledCoreAreasM2",
    label: "Sampled core areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampledCoreAreasM2.forEach((v) => positive(v, "sampledCoreAreasM2"));
  input.coreDryMassesGrams.forEach((v) => nonnegative(v, "coreDryMassesGrams"));
  input.coreAshMassesGrams.forEach((v) => nonnegative(v, "coreAshMassesGrams"));
  aligned(
    input.coreDryMassesGrams,
    input.coreAshMassesGrams,
    "coreDryMassesGrams",
  );
  aligned(
    input.coreDryMassesGrams,
    input.sampledCoreAreasM2,
    "coreDryMassesGrams",
  );
  const net = input.coreDryMassesGrams.reduce(
      (s, v, i) =>
        s + nonnegative(v - input.coreAshMassesGrams[i], "coreAshMassesGrams"),
      0,
    ),
    ashFreeFloorDryMassKgPerM2 =
      net / 1000 / input.sampledCoreAreasM2.reduce((a, b) => a + b, 0);
  return {
    ashFreeFloorDryMassKgPerM2,
    ashFreeFloorDryBiomassTonnesPerHa: 10 * ashFreeFloorDryMassKgPerM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coreDryMassesGrams: [100, 200],
  coreAshMassesGrams: [10, 20],
  sampledCoreAreasM2: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  ashFreeFloorDryMassKgPerM2: 0.9,
  ashFreeFloorDryBiomassTonnesPerHa: 9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/forest-floor-biomass",
  title: "Forest Floor Biomass",
  description:
    "Aggregate ash-free sampled forest-floor dry mass by actual combined core area; ash subtraction is a protocol-dependent organic biomass proxy, not a litter-only wet mass or homogeneous-layer assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "ashFreeFloorDryMassKgPerM2",
      label: "Ash free floor dry mass kg per m2",
      kind: "number",
    },
    {
      id: "ashFreeFloorDryBiomassTonnesPerHa",
      label: "Ash free floor dry biomass tonnes per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coreDryMassesGrams: value.coreDryMassesGrams as readonly number[],
      coreAshMassesGrams: value.coreAshMassesGrams as readonly number[],
      sampledCoreAreasM2: value.sampledCoreAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
