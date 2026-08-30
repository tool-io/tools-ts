import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly trayCatchMassesGrams: readonly number[];
  readonly trayOpeningAreasM2: readonly number[];
  readonly representedSwathWidthsM: readonly number[];
  readonly numberOfEquivalentPasses: number;
}>;
export type Output = Readonly<{
  readonly localObservedApplicationKgPerHa: readonly number[];
  readonly swathWeightedApplicationKgPerHa: number;
}>;
const inputFields = [
  {
    id: "trayCatchMassesGrams",
    label: "Tray catch masses grams",
    kind: "numberList",
  },
  {
    id: "trayOpeningAreasM2",
    label: "Tray opening areas m2",
    kind: "numberList",
  },
  {
    id: "representedSwathWidthsM",
    label: "Represented swath widths m",
    kind: "numberList",
  },
  {
    id: "numberOfEquivalentPasses",
    label: "Number of equivalent passes",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.trayOpeningAreasM2.forEach((v) => positive(v, "trayOpeningAreasM2"));
  input.representedSwathWidthsM.forEach((v) =>
    positive(v, "representedSwathWidthsM"),
  );
  positive(input.numberOfEquivalentPasses, "numberOfEquivalentPasses");
  input.trayCatchMassesGrams.forEach((v) =>
    nonnegative(v, "trayCatchMassesGrams"),
  );
  count(input.numberOfEquivalentPasses, "numberOfEquivalentPasses");
  aligned(
    input.trayCatchMassesGrams,
    input.trayOpeningAreasM2,
    "trayCatchMassesGrams",
  );
  aligned(
    input.trayCatchMassesGrams,
    input.representedSwathWidthsM,
    "trayCatchMassesGrams",
  );
  const localObservedApplicationKgPerHa = input.trayCatchMassesGrams.map(
      (v, i) =>
        (10 * v) /
        (input.trayOpeningAreasM2[i] * input.numberOfEquivalentPasses),
    ),
    width = input.representedSwathWidthsM.reduce((a, b) => a + b, 0);
  return {
    localObservedApplicationKgPerHa,
    swathWeightedApplicationKgPerHa: localObservedApplicationKgPerHa.reduce(
      (s, v, i) => s + (v * input.representedSwathWidthsM[i]) / width,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trayCatchMassesGrams: [10, 30],
  trayOpeningAreasM2: [1, 2],
  representedSwathWidthsM: [1, 3],
  numberOfEquivalentPasses: 1,
} satisfies Input;
export const exampleOutput = {
  localObservedApplicationKgPerHa: [100, 150],
  swathWeightedApplicationKgPerHa: 137.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/fertilizer-spreader-calibration",
  title: "Agriculture Fertilizer Spreader Calibration",
  description:
    "Calibrate observed spreader deposition from catcher masses/areas/passes and represented lateral widths; not a target nutrient rate, uniformity coefficient or a broadcast recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "localObservedApplicationKgPerHa",
      label: "Local observed application kg per ha",
      kind: "numberList",
    },
    {
      id: "swathWeightedApplicationKgPerHa",
      label: "Swath weighted application kg per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trayCatchMassesGrams: value.trayCatchMassesGrams as readonly number[],
      trayOpeningAreasM2: value.trayOpeningAreasM2 as readonly number[],
      representedSwathWidthsM:
        value.representedSwathWidthsM as readonly number[],
      numberOfEquivalentPasses: value.numberOfEquivalentPasses as number,
    }),
});
export const run = tool.execute;
export default tool;
