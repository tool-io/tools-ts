import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly feedMassKg: number;
  readonly feedIronMassFraction: number;
  readonly slagMassKg: number;
  readonly slagIronMassFraction: number;
  readonly otherIronLossKg: number;
}>;
export type Output = Readonly<{
  readonly feedIronKg: number;
  readonly slagIronKg: number;
  readonly modelRecoveredIronKg: number;
  readonly modelIronRecoveryFraction: number;
}>;
const inputFields = [
  { id: "feedMassKg", label: "Feed mass kg", kind: "number" },
  {
    id: "feedIronMassFraction",
    label: "Feed iron mass fraction",
    kind: "number",
  },
  { id: "slagMassKg", label: "Slag mass kg", kind: "number" },
  {
    id: "slagIronMassFraction",
    label: "Slag iron mass fraction",
    kind: "number",
  },
  { id: "otherIronLossKg", label: "Other iron loss kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.feedMassKg, "feedMassKg");
  nonnegative(input.slagMassKg, "slagMassKg");
  nonnegative(input.otherIronLossKg, "otherIronLossKg");
  fraction(input.feedIronMassFraction, "feedIronMassFraction");
  fraction(input.slagIronMassFraction, "slagIronMassFraction");
  const feedIronKg = positive(
      input.feedMassKg * input.feedIronMassFraction,
      "feedIron",
    ),
    slagIronKg = input.slagMassKg * input.slagIronMassFraction,
    modelRecoveredIronKg = nonnegative(
      feedIronKg - slagIronKg - input.otherIronLossKg,
      "massBalance",
    );
  return {
    feedIronKg,
    slagIronKg,
    modelRecoveredIronKg,
    modelIronRecoveryFraction: modelRecoveredIronKg / feedIronKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedMassKg: 100,
  feedIronMassFraction: 0.5,
  slagMassKg: 40,
  slagIronMassFraction: 0.25,
  otherIronLossKg: 5,
} satisfies Input;
export const exampleOutput = {
  feedIronKg: 50,
  slagIronKg: 10,
  modelRecoveredIronKg: 35,
  modelIronRecoveryFraction: 0.7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/metallurgical-slag-iron-yield",
  title: "Slag Iron Yield",
  description:
    "Balance elemental iron in declared feed, slag and other loss to a recovered-iron scenario; elemental versus oxide assay basis must be consistent, and slag composition alone cannot establish yield.",
  inputs: inputFields,
  outputs: [
    { id: "feedIronKg", label: "Feed iron kg", kind: "number" },
    { id: "slagIronKg", label: "Slag iron kg", kind: "number" },
    {
      id: "modelRecoveredIronKg",
      label: "Model recovered iron kg",
      kind: "number",
    },
    {
      id: "modelIronRecoveryFraction",
      label: "Model iron recovery fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedMassKg: value.feedMassKg as number,
      feedIronMassFraction: value.feedIronMassFraction as number,
      slagMassKg: value.slagMassKg as number,
      slagIronMassFraction: value.slagIronMassFraction as number,
      otherIronLossKg: value.otherIronLossKg as number,
    }),
});
export const run = tool.execute;
export default tool;
