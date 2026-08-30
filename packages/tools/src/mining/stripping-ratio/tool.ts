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
  readonly wasteBankVolumesM3: readonly number[];
  readonly oreBankVolumesM3: readonly number[];
  readonly wasteDensityTonnesPerM3: number;
  readonly oreDensityTonnesPerM3: number;
}>;
export type Output = Readonly<{
  readonly volumeStrippingRatio: number;
  readonly massStrippingRatio: number;
  readonly wasteTonnes: number;
  readonly oreTonnes: number;
}>;
const inputFields = [
  {
    id: "wasteBankVolumesM3",
    label: "Waste bank volumes m3",
    kind: "numberList",
  },
  { id: "oreBankVolumesM3", label: "Ore bank volumes m3", kind: "numberList" },
  {
    id: "wasteDensityTonnesPerM3",
    label: "Waste density tonnes per m3",
    kind: "number",
  },
  {
    id: "oreDensityTonnesPerM3",
    label: "Ore density tonnes per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wasteDensityTonnesPerM3, "wasteDensityTonnesPerM3");
  positive(input.oreDensityTonnesPerM3, "oreDensityTonnesPerM3");
  input.wasteBankVolumesM3.forEach((v) => nonnegative(v, "wasteBankVolumesM3"));
  input.oreBankVolumesM3.forEach((v) => nonnegative(v, "oreBankVolumesM3"));
  aligned(
    input.wasteBankVolumesM3,
    input.oreBankVolumesM3,
    "wasteBankVolumesM3",
  );
  const w = input.wasteBankVolumesM3.reduce((a, b) => a + b, 0),
    o = positive(
      input.oreBankVolumesM3.reduce((a, b) => a + b, 0),
      "oreBankVolumesM3",
    );
  return {
    volumeStrippingRatio: w / o,
    massStrippingRatio:
      (w * input.wasteDensityTonnesPerM3) / (o * input.oreDensityTonnesPerM3),
    wasteTonnes: w * input.wasteDensityTonnesPerM3,
    oreTonnes: o * input.oreDensityTonnesPerM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wasteBankVolumesM3: [100, 200],
  oreBankVolumesM3: [50, 100],
  wasteDensityTonnesPerM3: 2,
  oreDensityTonnesPerM3: 3,
} satisfies Input;
export const exampleOutput = {
  volumeStrippingRatio: 2,
  massStrippingRatio: 1.3333333333333333,
  wasteTonnes: 600,
  oreTonnes: 450,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-ratio",
  title: "Stripping Ratio",
  description:
    "Aggregate bank-volume stripping quantities and distinguish waste/ore volume and mass ratios using supplied densities; excludes loose-volume swell.",
  inputs: inputFields,
  outputs: [
    {
      id: "volumeStrippingRatio",
      label: "Volume stripping ratio",
      kind: "number",
    },
    { id: "massStrippingRatio", label: "Mass stripping ratio", kind: "number" },
    { id: "wasteTonnes", label: "Waste tonnes", kind: "number" },
    { id: "oreTonnes", label: "Ore tonnes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      wasteBankVolumesM3: value.wasteBankVolumesM3 as readonly number[],
      oreBankVolumesM3: value.oreBankVolumesM3 as readonly number[],
      wasteDensityTonnesPerM3: value.wasteDensityTonnesPerM3 as number,
      oreDensityTonnesPerM3: value.oreDensityTonnesPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
