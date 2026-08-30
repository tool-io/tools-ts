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
  readonly preBurnDryLoadsKgPerM2: readonly number[];
  readonly postBurnDryLoadsKgPerM2: readonly number[];
  readonly representedAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly consumedDryMassTonnes: number;
  readonly consumedDryTonnesPerHa: number;
  readonly signedConsumedLoadKgPerM2: readonly number[];
}>;
const inputFields = [
  {
    id: "preBurnDryLoadsKgPerM2",
    label: "Pre burn dry loads kg per m2",
    kind: "numberList",
  },
  {
    id: "postBurnDryLoadsKgPerM2",
    label: "Post burn dry loads kg per m2",
    kind: "numberList",
  },
  {
    id: "representedAreasM2",
    label: "Represented areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedAreasM2.forEach((v) => positive(v, "representedAreasM2"));
  input.preBurnDryLoadsKgPerM2.forEach((v) =>
    nonnegative(v, "preBurnDryLoadsKgPerM2"),
  );
  input.postBurnDryLoadsKgPerM2.forEach((v) =>
    nonnegative(v, "postBurnDryLoadsKgPerM2"),
  );
  aligned(
    input.preBurnDryLoadsKgPerM2,
    input.postBurnDryLoadsKgPerM2,
    "preBurnDryLoadsKgPerM2",
  );
  aligned(
    input.preBurnDryLoadsKgPerM2,
    input.representedAreasM2,
    "preBurnDryLoadsKgPerM2",
  );
  const signedConsumedLoadKgPerM2 = input.preBurnDryLoadsKgPerM2.map(
      (v, i) => v - input.postBurnDryLoadsKgPerM2[i],
    ),
    mass = signedConsumedLoadKgPerM2.reduce(
      (s, v, i) => s + v * input.representedAreasM2[i],
      0,
    ),
    area = input.representedAreasM2.reduce((a, b) => a + b, 0);
  return {
    consumedDryMassTonnes: mass / 1000,
    consumedDryTonnesPerHa: (10 * mass) / area,
    signedConsumedLoadKgPerM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preBurnDryLoadsKgPerM2: [1, 2],
  postBurnDryLoadsKgPerM2: [0.5, 1.5],
  representedAreasM2: [100, 200],
} satisfies Input;
export const exampleOutput = {
  consumedDryMassTonnes: 0.15,
  consumedDryTonnesPerHa: 5,
  signedConsumedLoadKgPerM2: [0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/prescribed-burn-unit-area-consumption-tonnes",
  title: "Prescribed Burn Consumption Tonnes Per Unit Area",
  description:
    "Difference matched pre/post dry-load measurements with physical area weights, retaining negative apparent consumption rather than clipping measurement/background changes; not a prescribed-burn recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "consumedDryMassTonnes",
      label: "Consumed dry mass tonnes",
      kind: "number",
    },
    {
      id: "consumedDryTonnesPerHa",
      label: "Consumed dry tonnes per ha",
      kind: "number",
    },
    {
      id: "signedConsumedLoadKgPerM2",
      label: "Signed consumed load kg per m2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      preBurnDryLoadsKgPerM2: value.preBurnDryLoadsKgPerM2 as readonly number[],
      postBurnDryLoadsKgPerM2:
        value.postBurnDryLoadsKgPerM2 as readonly number[],
      representedAreasM2: value.representedAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
