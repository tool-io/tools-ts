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
  readonly combAreasCm2: readonly number[];
  readonly honeyDepthsCm: readonly number[];
  readonly filledFractions: readonly number[];
  readonly honeyDensityGramsPerCm3: number;
  readonly emptyFrameMassKg: number;
}>;
export type Output = Readonly<{
  readonly estimatedHoneyMassKg: number;
  readonly estimatedFullFrameMassKg: number;
}>;
const inputFields = [
  { id: "combAreasCm2", label: "Comb areas cm2", kind: "numberList" },
  { id: "honeyDepthsCm", label: "Honey depths cm", kind: "numberList" },
  { id: "filledFractions", label: "Filled fractions", kind: "numberList" },
  {
    id: "honeyDensityGramsPerCm3",
    label: "Honey density grams per cm3",
    kind: "number",
  },
  { id: "emptyFrameMassKg", label: "Empty frame mass kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.combAreasCm2.forEach((v) => positive(v, "combAreasCm2"));
  positive(input.honeyDensityGramsPerCm3, "honeyDensityGramsPerCm3");
  input.honeyDepthsCm.forEach((v) => nonnegative(v, "honeyDepthsCm"));
  nonnegative(input.emptyFrameMassKg, "emptyFrameMassKg");
  input.filledFractions.forEach((v) => fraction(v, "filledFractions"));
  aligned(input.combAreasCm2, input.honeyDepthsCm, "combAreasCm2");
  aligned(input.combAreasCm2, input.filledFractions, "combAreasCm2");
  const estimatedHoneyMassKg =
    (input.combAreasCm2.reduce(
      (s, a, i) => s + a * input.honeyDepthsCm[i] * input.filledFractions[i],
      0,
    ) *
      input.honeyDensityGramsPerCm3) /
    1000;
  return {
    estimatedHoneyMassKg,
    estimatedFullFrameMassKg: estimatedHoneyMassKg + input.emptyFrameMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  combAreasCm2: [1000, 500],
  honeyDepthsCm: [1, 0.5],
  filledFractions: [0.8, 1],
  honeyDensityGramsPerCm3: 1.4,
  emptyFrameMassKg: 0.5,
} satisfies Input;
export const exampleOutput = {
  estimatedHoneyMassKg: 1.47,
  estimatedFullFrameMassKg: 1.97,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/honey-frame-weight-full-estimate",
  title: "Honey Frame Weight Full Estimate",
  description:
    "Estimate honey mass from distinct comb-face areas, filled honey depths and supplied density, adding frame tare; no nominal full-frame capacity table.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedHoneyMassKg",
      label: "Estimated honey mass kg",
      kind: "number",
    },
    {
      id: "estimatedFullFrameMassKg",
      label: "Estimated full frame mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      combAreasCm2: value.combAreasCm2 as readonly number[],
      honeyDepthsCm: value.honeyDepthsCm as readonly number[],
      filledFractions: value.filledFractions as readonly number[],
      honeyDensityGramsPerCm3: value.honeyDensityGramsPerCm3 as number,
      emptyFrameMassKg: value.emptyFrameMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
