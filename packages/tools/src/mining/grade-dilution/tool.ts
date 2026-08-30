import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly oreTonnes: number;
  readonly oreGrade: number;
  readonly diluentTonnes: number;
  readonly diluentGrade: number;
}>;
export type Output = Readonly<{
  readonly dilutedGrade: number;
  readonly diluentFractionOfMinedMass: number;
  readonly relativeGradeChange: number;
}>;
const inputFields = [
  { id: "oreTonnes", label: "Ore tonnes", kind: "number" },
  { id: "oreGrade", label: "Ore grade", kind: "number" },
  { id: "diluentTonnes", label: "Diluent tonnes", kind: "number" },
  { id: "diluentGrade", label: "Diluent grade", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.oreTonnes, "oreTonnes");
  positive(input.oreGrade, "oreGrade");
  nonnegative(input.diluentTonnes, "diluentTonnes");
  nonnegative(input.diluentGrade, "diluentGrade");
  const dilutedGrade =
    (input.oreTonnes * input.oreGrade +
      input.diluentTonnes * input.diluentGrade) /
    (input.oreTonnes + input.diluentTonnes);
  return {
    dilutedGrade,
    diluentFractionOfMinedMass:
      input.diluentTonnes / (input.oreTonnes + input.diluentTonnes),
    relativeGradeChange: dilutedGrade / input.oreGrade - 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oreTonnes: 100,
  oreGrade: 2,
  diluentTonnes: 20,
  diluentGrade: 0.5,
} satisfies Input;
export const exampleOutput = {
  dilutedGrade: 1.75,
  diluentFractionOfMinedMass: 0.16666666666666666,
  relativeGradeChange: -0.125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/grade-dilution",
  title: "Grade Dilution",
  description:
    "Balance ore and nonzero-grade diluent on a mass basis; grades share one unit, and higher-grade diluent may increase rather than reduce blended grade.",
  inputs: inputFields,
  outputs: [
    { id: "dilutedGrade", label: "Diluted grade", kind: "number" },
    {
      id: "diluentFractionOfMinedMass",
      label: "Diluent fraction of mined mass",
      kind: "number",
    },
    {
      id: "relativeGradeChange",
      label: "Relative grade change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      oreTonnes: value.oreTonnes as number,
      oreGrade: value.oreGrade as number,
      diluentTonnes: value.diluentTonnes as number,
      diluentGrade: value.diluentGrade as number,
    }),
});
export const run = tool.execute;
export default tool;
