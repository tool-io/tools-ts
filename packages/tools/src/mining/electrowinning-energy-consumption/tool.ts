import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly cellVoltage: number;
  readonly electronStoichiometry: number;
  readonly molarMassKgPerMol: number;
  readonly currentEfficiency: number;
  readonly faradayCoulombsPerMol: number;
  readonly rectifierEfficiency: number;
}>;
export type Output = Readonly<{
  readonly dcEnergyKwhPerKg: number;
  readonly gridEnergyKwhPerKg: number;
}>;
const inputFields = [
  { id: "cellVoltage", label: "Cell voltage", kind: "number" },
  {
    id: "electronStoichiometry",
    label: "Electron stoichiometry",
    kind: "integer",
  },
  { id: "molarMassKgPerMol", label: "Molar mass kg per mol", kind: "number" },
  { id: "currentEfficiency", label: "Current efficiency", kind: "number" },
  {
    id: "faradayCoulombsPerMol",
    label: "Faraday coulombs per mol",
    kind: "number",
  },
  { id: "rectifierEfficiency", label: "Rectifier efficiency", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cellVoltage, "cellVoltage");
  positive(input.electronStoichiometry, "electronStoichiometry");
  positive(input.molarMassKgPerMol, "molarMassKgPerMol");
  positive(input.currentEfficiency, "currentEfficiency");
  positive(input.faradayCoulombsPerMol, "faradayCoulombsPerMol");
  positive(input.rectifierEfficiency, "rectifierEfficiency");
  fraction(input.currentEfficiency, "currentEfficiency");
  fraction(input.rectifierEfficiency, "rectifierEfficiency");
  count(input.electronStoichiometry, "electronStoichiometry");
  const dcEnergyKwhPerKg =
    (input.cellVoltage *
      input.electronStoichiometry *
      input.faradayCoulombsPerMol) /
    (input.molarMassKgPerMol * input.currentEfficiency * 3600000);
  return {
    dcEnergyKwhPerKg,
    gridEnergyKwhPerKg: dcEnergyKwhPerKg / input.rectifierEfficiency,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cellVoltage: 2,
  electronStoichiometry: 2,
  molarMassKgPerMol: 0.064,
  currentEfficiency: 0.8,
  faradayCoulombsPerMol: 96000,
  rectifierEfficiency: 0.9,
} satisfies Input;
export const exampleOutput = {
  dcEnergyKwhPerKg: 2.0833333333333335,
  gridEnergyKwhPerKg: 2.314814814814815,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/electrowinning-energy-consumption",
  title: "Electrowinning Energy Consumption",
  description:
    "Derive DC and grid rectifier energy per kilogram from Faraday charge balance and caller efficiencies; auxiliary pumps and heating are excluded.",
  inputs: inputFields,
  outputs: [
    { id: "dcEnergyKwhPerKg", label: "Dc energy kwh per kg", kind: "number" },
    {
      id: "gridEnergyKwhPerKg",
      label: "Grid energy kwh per kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cellVoltage: value.cellVoltage as number,
      electronStoichiometry: value.electronStoichiometry as number,
      molarMassKgPerMol: value.molarMassKgPerMol as number,
      currentEfficiency: value.currentEfficiency as number,
      faradayCoulombsPerMol: value.faradayCoulombsPerMol as number,
      rectifierEfficiency: value.rectifierEfficiency as number,
    }),
});
export const run = tool.execute;
export default tool;
