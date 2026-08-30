import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredMarineAgeBp: number;
  readonly regionalReservoirAgeYears: number;
  readonly localDeltaRYears: number;
  readonly measurementSigmaYears: number;
  readonly reservoirSigmaYears: number;
  readonly deltaRSigmaYears: number;
}>;
export type Output = Readonly<{
  readonly reservoirCorrectedAgeBp: number;
  readonly independentCombinedSigmaYears: number;
}>;
const inputFields = [
  {
    id: "measuredMarineAgeBp",
    label: "Measured marine age bp",
    kind: "number",
  },
  {
    id: "regionalReservoirAgeYears",
    label: "Regional reservoir age years",
    kind: "number",
  },
  { id: "localDeltaRYears", label: "Local delta r years", kind: "number" },
  {
    id: "measurementSigmaYears",
    label: "Measurement sigma years",
    kind: "number",
  },
  { id: "reservoirSigmaYears", label: "Reservoir sigma years", kind: "number" },
  { id: "deltaRSigmaYears", label: "Delta r sigma years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.measurementSigmaYears, "measurementSigmaYears");
  nonnegative(input.reservoirSigmaYears, "reservoirSigmaYears");
  nonnegative(input.deltaRSigmaYears, "deltaRSigmaYears");
  nonnegative(input.regionalReservoirAgeYears, "regionalReservoirAgeYears");
  return {
    reservoirCorrectedAgeBp:
      input.measuredMarineAgeBp -
      input.regionalReservoirAgeYears -
      input.localDeltaRYears,
    independentCombinedSigmaYears: Math.hypot(
      input.measurementSigmaYears,
      input.reservoirSigmaYears,
      input.deltaRSigmaYears,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredMarineAgeBp: 1000,
  regionalReservoirAgeYears: 400,
  localDeltaRYears: -50,
  measurementSigmaYears: 20,
  reservoirSigmaYears: 30,
  deltaRSigmaYears: 10,
} satisfies Input;
export const exampleOutput = {
  reservoirCorrectedAgeBp: 650,
  independentCombinedSigmaYears: 37.416573867739416,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/marine-reservoir-correction",
  title: "Marine Reservoir Correction",
  description:
    "Subtract supplied regional reservoir age plus local delta-R and propagate independent uncertainties; corrected ages can be signed and are not calendar-calibrated ages.",
  inputs: inputFields,
  outputs: [
    {
      id: "reservoirCorrectedAgeBp",
      label: "Reservoir corrected age bp",
      kind: "number",
    },
    {
      id: "independentCombinedSigmaYears",
      label: "Independent combined sigma years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredMarineAgeBp: value.measuredMarineAgeBp as number,
      regionalReservoirAgeYears: value.regionalReservoirAgeYears as number,
      localDeltaRYears: value.localDeltaRYears as number,
      measurementSigmaYears: value.measurementSigmaYears as number,
      reservoirSigmaYears: value.reservoirSigmaYears as number,
      deltaRSigmaYears: value.deltaRSigmaYears as number,
    }),
});
export const run = tool.execute;
export default tool;
