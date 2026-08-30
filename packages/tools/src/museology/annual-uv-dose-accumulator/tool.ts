import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedLux: readonly number[];
  readonly uvContentMicrowattsPerLumen: readonly number[];
  readonly exposureHours: readonly number[];
  readonly uvTransmissionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly uvEnergyJoulesPerM2: number;
  readonly unfilteredUvEnergyJoulesPerM2: number;
}>;
const inputFields = [
  { id: "observedLux", label: "Observed lux", kind: "numberList" },
  {
    id: "uvContentMicrowattsPerLumen",
    label: "Uv content microwatts per lumen",
    kind: "numberList",
  },
  { id: "exposureHours", label: "Exposure hours", kind: "numberList" },
  {
    id: "uvTransmissionFractions",
    label: "Uv transmission fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLux.forEach((v) => nonnegative(v, "observedLux"));
  input.uvContentMicrowattsPerLumen.forEach((v) =>
    nonnegative(v, "uvContentMicrowattsPerLumen"),
  );
  input.exposureHours.forEach((v) => nonnegative(v, "exposureHours"));
  input.uvTransmissionFractions.forEach((v) =>
    fraction(v, "uvTransmissionFractions"),
  );
  aligned(input.observedLux, input.uvContentMicrowattsPerLumen, "observedLux");
  aligned(input.observedLux, input.exposureHours, "observedLux");
  aligned(input.observedLux, input.uvTransmissionFractions, "observedLux");
  const dose = input.observedLux.map(
    (v, i) =>
      0.0036 *
      v *
      input.uvContentMicrowattsPerLumen[i] *
      input.exposureHours[i],
  );
  return {
    uvEnergyJoulesPerM2: dose.reduce(
      (s, v, i) => s + v * input.uvTransmissionFractions[i],
      0,
    ),
    unfilteredUvEnergyJoulesPerM2: sum(dose),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLux: [100, 50],
  uvContentMicrowattsPerLumen: [10, 20],
  exposureHours: [2, 3],
  uvTransmissionFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  uvEnergyJoulesPerM2: 12.6,
  unfilteredUvEnergyJoulesPerM2: 18,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/annual-uv-dose-accumulator",
  title: "Annual UV Dose Exposure Accumulator Calculator",
  description:
    "Accumulate matched UV content×lux×hours with separate filter transmissions; conversion is 0.0036 J/m² per µW/m²-hour, not lux-hours alone or predicted fading.",
  inputs: inputFields,
  outputs: [
    {
      id: "uvEnergyJoulesPerM2",
      label: "Uv energy joules per m2",
      kind: "number",
    },
    {
      id: "unfilteredUvEnergyJoulesPerM2",
      label: "Unfiltered uv energy joules per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLux: value.observedLux as readonly number[],
      uvContentMicrowattsPerLumen:
        value.uvContentMicrowattsPerLumen as readonly number[],
      exposureHours: value.exposureHours as readonly number[],
      uvTransmissionFractions:
        value.uvTransmissionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
