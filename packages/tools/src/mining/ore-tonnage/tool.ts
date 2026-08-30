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
  readonly blockVolumesM3: readonly number[];
  readonly blockDensitiesTonnesPerM3: readonly number[];
  readonly oreFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly blockOreTonnes: readonly number[];
  readonly totalOreTonnes: number;
}>;
const inputFields = [
  { id: "blockVolumesM3", label: "Block volumes m3", kind: "numberList" },
  {
    id: "blockDensitiesTonnesPerM3",
    label: "Block densities tonnes per m3",
    kind: "numberList",
  },
  { id: "oreFractions", label: "Ore fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.blockDensitiesTonnesPerM3.forEach((v) =>
    positive(v, "blockDensitiesTonnesPerM3"),
  );
  input.blockVolumesM3.forEach((v) => nonnegative(v, "blockVolumesM3"));
  input.oreFractions.forEach((v) => fraction(v, "oreFractions"));
  aligned(
    input.blockVolumesM3,
    input.blockDensitiesTonnesPerM3,
    "blockVolumesM3",
  );
  aligned(input.blockVolumesM3, input.oreFractions, "blockVolumesM3");
  const blockOreTonnes = input.blockVolumesM3.map(
    (v, i) => v * input.blockDensitiesTonnesPerM3[i] * input.oreFractions[i],
  );
  return {
    blockOreTonnes,
    totalOreTonnes: blockOreTonnes.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  blockVolumesM3: [100, 200],
  blockDensitiesTonnesPerM3: [2, 3],
  oreFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  blockOreTonnes: [100, 600],
  totalOreTonnes: 700,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-tonnage",
  title: "Ore Tonnage",
  description:
    "Sum block ore tonnage from bank volumes, densities and modeled ore fractions; no resource classification or geological continuity is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "blockOreTonnes", label: "Block ore tonnes", kind: "numberList" },
    { id: "totalOreTonnes", label: "Total ore tonnes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      blockVolumesM3: value.blockVolumesM3 as readonly number[],
      blockDensitiesTonnesPerM3:
        value.blockDensitiesTonnesPerM3 as readonly number[],
      oreFractions: value.oreFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
