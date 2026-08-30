import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly denseRockEquivalentVolumeM3: number;
  readonly denseRockDensityKgPerM3: number;
  readonly depositBulkDensityKgPerM3: number;
  readonly juvenileMassFraction: number;
}>;
export type Output = Readonly<{
  readonly tephraBulkVolumeM3: number;
  readonly totalDepositMassKg: number;
  readonly juvenileMassKg: number;
  readonly lithicMassKg: number;
}>;
const inputFields = [
  {
    id: "denseRockEquivalentVolumeM3",
    label: "Dense rock equivalent volume m3",
    kind: "number",
  },
  {
    id: "denseRockDensityKgPerM3",
    label: "Dense rock density kg per m3",
    kind: "number",
  },
  {
    id: "depositBulkDensityKgPerM3",
    label: "Deposit bulk density kg per m3",
    kind: "number",
  },
  {
    id: "juvenileMassFraction",
    label: "Juvenile mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.denseRockDensityKgPerM3, "denseRockDensityKgPerM3");
  positive(input.depositBulkDensityKgPerM3, "depositBulkDensityKgPerM3");
  nonnegative(input.denseRockEquivalentVolumeM3, "denseRockEquivalentVolumeM3");
  fraction(input.juvenileMassFraction, "juvenileMassFraction");
  const totalDepositMassKg =
    input.denseRockEquivalentVolumeM3 * input.denseRockDensityKgPerM3;
  return {
    tephraBulkVolumeM3: totalDepositMassKg / input.depositBulkDensityKgPerM3,
    totalDepositMassKg,
    juvenileMassKg: totalDepositMassKg * input.juvenileMassFraction,
    lithicMassKg: totalDepositMassKg * (1 - input.juvenileMassFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  denseRockEquivalentVolumeM3: 100,
  denseRockDensityKgPerM3: 2000,
  depositBulkDensityKgPerM3: 1000,
  juvenileMassFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  tephraBulkVolumeM3: 200,
  totalDepositMassKg: 200000,
  juvenileMassKg: 160000,
  lithicMassKg: 40000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/dre-to-tephra-volume-conversion",
  title: "DRE To Tephra Volume Conversion",
  description:
    "Convert declared whole-deposit DRE to bulk tephra volume by mass conservation, splitting supplied juvenile/lithic mass share; packing, vesicles and interclast pores are already embodied in measured bulk density.",
  inputs: inputFields,
  outputs: [
    {
      id: "tephraBulkVolumeM3",
      label: "Tephra bulk volume m3",
      kind: "number",
    },
    {
      id: "totalDepositMassKg",
      label: "Total deposit mass kg",
      kind: "number",
    },
    { id: "juvenileMassKg", label: "Juvenile mass kg", kind: "number" },
    { id: "lithicMassKg", label: "Lithic mass kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      denseRockEquivalentVolumeM3: value.denseRockEquivalentVolumeM3 as number,
      denseRockDensityKgPerM3: value.denseRockDensityKgPerM3 as number,
      depositBulkDensityKgPerM3: value.depositBulkDensityKgPerM3 as number,
      juvenileMassFraction: value.juvenileMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
