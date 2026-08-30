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
  readonly referenceLayerThicknessesM: readonly number[];
  readonly referenceDensitiesKgPerM3: readonly number[];
  readonly observedDensitiesKgPerM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerStericChangesM: readonly number[];
  readonly totalStericSeaLevelChangeM: number;
}>;
const inputFields = [
  {
    id: "referenceLayerThicknessesM",
    label: "Reference layer thicknesses m",
    kind: "numberList",
  },
  {
    id: "referenceDensitiesKgPerM3",
    label: "Reference densities kg per m3",
    kind: "numberList",
  },
  {
    id: "observedDensitiesKgPerM3",
    label: "Observed densities kg per m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.referenceDensitiesKgPerM3.forEach((v) =>
    positive(v, "referenceDensitiesKgPerM3"),
  );
  input.observedDensitiesKgPerM3.forEach((v) =>
    positive(v, "observedDensitiesKgPerM3"),
  );
  input.referenceLayerThicknessesM.forEach((v) =>
    nonnegative(v, "referenceLayerThicknessesM"),
  );
  aligned(
    input.referenceLayerThicknessesM,
    input.referenceDensitiesKgPerM3,
    "referenceLayerThicknessesM",
  );
  aligned(
    input.referenceLayerThicknessesM,
    input.observedDensitiesKgPerM3,
    "referenceLayerThicknessesM",
  );
  const layerStericChangesM = input.referenceLayerThicknessesM.map(
    (h, i) =>
      (h *
        (input.referenceDensitiesKgPerM3[i] -
          input.observedDensitiesKgPerM3[i])) /
      input.observedDensitiesKgPerM3[i],
  );
  return {
    layerStericChangesM,
    totalStericSeaLevelChangeM: layerStericChangesM.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceLayerThicknessesM: [10, 20],
  referenceDensitiesKgPerM3: [1000, 1000],
  observedDensitiesKgPerM3: [990, 1010],
} satisfies Input;
export const exampleOutput = {
  layerStericChangesM: [0.10101010101010101, -0.19801980198019803],
  totalStericSeaLevelChangeM: -0.09700970097009702,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/steric-sea-level-expansion-contribution",
  title: "Steric Sea Level Expansion Contribution",
  description:
    "Compute exact mass-conserving layer stretching from paired density states; includes combined density effects, unlike first-order thermal-only anomaly, and excludes mass loading.",
  inputs: inputFields,
  outputs: [
    {
      id: "layerStericChangesM",
      label: "Layer steric changes m",
      kind: "numberList",
    },
    {
      id: "totalStericSeaLevelChangeM",
      label: "Total steric sea level change m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceLayerThicknessesM:
        value.referenceLayerThicknessesM as readonly number[],
      referenceDensitiesKgPerM3:
        value.referenceDensitiesKgPerM3 as readonly number[],
      observedDensitiesKgPerM3:
        value.observedDensitiesKgPerM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
