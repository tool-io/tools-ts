import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPcmTemperaturesKelvin: readonly number[];
  readonly observedPcmCrystallineFraction: readonly number[];
  readonly callerCrystallizationFractionCriterion: number;
}>;
export type Output = Readonly<{
  readonly measuredCrystallizationTemperatureCrossingsKelvin: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPcmTemperaturesKelvin",
    label: "Observed pcm temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedPcmCrystallineFraction",
    label: "Observed pcm crystalline fraction",
    kind: "numberList",
  },
  {
    id: "callerCrystallizationFractionCriterion",
    label: "Caller crystallization fraction criterion",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPcmTemperaturesKelvin.forEach((v) =>
    nonnegative(v, "observedPcmTemperaturesKelvin"),
  );
  input.observedPcmCrystallineFraction.forEach((v) =>
    nonnegative(v, "observedPcmCrystallineFraction"),
  );
  nonnegative(
    input.callerCrystallizationFractionCriterion,
    "callerCrystallizationFractionCriterion",
  );
  return {
    measuredCrystallizationTemperatureCrossingsKelvin: crossings(
      input.observedPcmTemperaturesKelvin,
      input.observedPcmCrystallineFraction,
      input.callerCrystallizationFractionCriterion,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPcmTemperaturesKelvin: [0, 1, 2],
  observedPcmCrystallineFraction: [0, 2, 4],
  callerCrystallizationFractionCriterion: 3,
} satisfies Input;
export const exampleOutput = {
  measuredCrystallizationTemperatureCrossingsKelvin: [1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/pcm-crystallization-temperature",
  title: "Semiconductor PCM Crystallization Temperature Calculator",
  description:
    "Extract all actual piecewise-linear measuredCrystallizationTemperatureCrossingsKelvin test crossings at explicitly supplied callerCrystallizationFractionCriterion, retain absent/multiple crossings; caller verifies test branch and evidence, no assumed device universal or operating/measurement procedure.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredCrystallizationTemperatureCrossingsKelvin",
      label: "Measured crystallization temperature crossings kelvin",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPcmTemperaturesKelvin:
        value.observedPcmTemperaturesKelvin as readonly number[],
      observedPcmCrystallineFraction:
        value.observedPcmCrystallineFraction as readonly number[],
      callerCrystallizationFractionCriterion:
        value.callerCrystallizationFractionCriterion as number,
    }),
});
export const run = tool.execute;
export default tool;
