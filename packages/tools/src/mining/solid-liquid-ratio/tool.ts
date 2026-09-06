import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSolidVolumesM3: readonly number[];
  readonly observedLiquidVolumesM3: readonly number[];
  readonly observedSolidDensitiesKgM3: readonly number[];
  readonly observedLiquidDensitiesKgM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedVolumeSolidLiquidRatios: readonly number[];
  readonly observedMassSolidLiquidRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSolidVolumesM3",
    label: "Observed solid volumes m3",
    kind: "numberList",
  },
  {
    id: "observedLiquidVolumesM3",
    label: "Observed liquid volumes m3",
    kind: "numberList",
  },
  {
    id: "observedSolidDensitiesKgM3",
    label: "Observed solid densities kg m3",
    kind: "numberList",
  },
  {
    id: "observedLiquidDensitiesKgM3",
    label: "Observed liquid densities kg m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLiquidVolumesM3.forEach((v) =>
    positive(v, "observedLiquidVolumesM3"),
  );
  input.observedSolidDensitiesKgM3.forEach((v) =>
    positive(v, "observedSolidDensitiesKgM3"),
  );
  input.observedLiquidDensitiesKgM3.forEach((v) =>
    positive(v, "observedLiquidDensitiesKgM3"),
  );
  input.observedSolidVolumesM3.forEach((v) =>
    nonnegative(v, "observedSolidVolumesM3"),
  );
  aligned(
    input.observedSolidVolumesM3,
    input.observedLiquidVolumesM3,
    "observedSolidVolumesM3",
  );
  aligned(
    input.observedSolidVolumesM3,
    input.observedSolidDensitiesKgM3,
    "observedSolidVolumesM3",
  );
  aligned(
    input.observedSolidVolumesM3,
    input.observedLiquidDensitiesKgM3,
    "observedSolidVolumesM3",
  );
  return {
    observedVolumeSolidLiquidRatios: input.observedSolidVolumesM3.map(
      (v, i) => v / input.observedLiquidVolumesM3[i],
    ),
    observedMassSolidLiquidRatios: input.observedSolidVolumesM3.map(
      (v, i) =>
        (v * input.observedSolidDensitiesKgM3[i]) /
        input.observedLiquidVolumesM3[i] /
        input.observedLiquidDensitiesKgM3[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSolidVolumesM3: [1, 2],
  observedLiquidVolumesM3: [2, 4],
  observedSolidDensitiesKgM3: [2, 3],
  observedLiquidDensitiesKgM3: [1, 1],
} satisfies Input;
export const exampleOutput = {
  observedVolumeSolidLiquidRatios: [0.5, 0.5],
  observedMassSolidLiquidRatios: [1, 1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/solid-liquid-ratio",
  title: "Solid Liquid Ratio Calculator",
  description:
    "Audit actual separately measured component volume ratios versus independently density-corrected mass ratios, not mass-only pulp percent solids or mixture density. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedVolumeSolidLiquidRatios",
      label: "Observed volume solid liquid ratios",
      kind: "numberList",
    },
    {
      id: "observedMassSolidLiquidRatios",
      label: "Observed mass solid liquid ratios",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSolidVolumesM3: value.observedSolidVolumesM3 as readonly number[],
      observedLiquidVolumesM3:
        value.observedLiquidVolumesM3 as readonly number[],
      observedSolidDensitiesKgM3:
        value.observedSolidDensitiesKgM3 as readonly number[],
      observedLiquidDensitiesKgM3:
        value.observedLiquidDensitiesKgM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
