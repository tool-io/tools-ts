import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly dryOreTonnes: readonly number[];
  readonly metalGradesGramsPerTonne: readonly number[];
  readonly recoveries: readonly number[];
}>;
export type Output = Readonly<{
  readonly containedMetalKg: readonly number[];
  readonly recoverableMetalKg: readonly number[];
  readonly totalContainedKg: number;
  readonly totalRecoverableKg: number;
}>;
const inputFields = [
  { id: "dryOreTonnes", label: "Dry ore tonnes", kind: "numberList" },
  {
    id: "metalGradesGramsPerTonne",
    label: "Metal grades grams per tonne",
    kind: "numberList",
  },
  { id: "recoveries", label: "Recoveries", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dryOreTonnes.forEach((v) => nonnegative(v, "dryOreTonnes"));
  input.metalGradesGramsPerTonne.forEach((v) =>
    nonnegative(v, "metalGradesGramsPerTonne"),
  );
  input.recoveries.forEach((v) => fraction(v, "recoveries"));
  aligned(input.dryOreTonnes, input.metalGradesGramsPerTonne, "dryOreTonnes");
  aligned(input.dryOreTonnes, input.recoveries, "dryOreTonnes");
  const containedMetalKg = input.dryOreTonnes.map(
      (v, i) => (v * input.metalGradesGramsPerTonne[i]) / 1000,
    ),
    recoverableMetalKg = containedMetalKg.map(
      (v, i) => v * input.recoveries[i],
    );
  return {
    containedMetalKg,
    recoverableMetalKg,
    totalContainedKg: containedMetalKg.reduce((a, b) => a + b, 0),
    totalRecoverableKg: recoverableMetalKg.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryOreTonnes: [100, 200],
  metalGradesGramsPerTonne: [2, 1],
  recoveries: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  containedMetalKg: [0.2, 0.2],
  recoverableMetalKg: [0.1, 0.2],
  totalContainedKg: 0.4,
  totalRecoverableKg: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/metal-content",
  title: "Metal Content",
  description:
    "Calculate contained and recovered metal across dry-tonnage lots with grades in g/t; caller recovery fractions do not establish reserves or payable-metal terms.",
  inputs: inputFields,
  outputs: [
    { id: "containedMetalKg", label: "Contained metal kg", kind: "numberList" },
    {
      id: "recoverableMetalKg",
      label: "Recoverable metal kg",
      kind: "numberList",
    },
    { id: "totalContainedKg", label: "Total contained kg", kind: "number" },
    { id: "totalRecoverableKg", label: "Total recoverable kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dryOreTonnes: value.dryOreTonnes as readonly number[],
      metalGradesGramsPerTonne:
        value.metalGradesGramsPerTonne as readonly number[],
      recoveries: value.recoveries as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
