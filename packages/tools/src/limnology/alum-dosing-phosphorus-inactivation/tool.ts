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
  readonly labileSedimentPhosphorusKg: number;
  readonly waterVolumeM3: number;
  readonly currentWaterPhosphorusMicrogramsPerLiter: number;
  readonly targetWaterPhosphorusMicrogramsPerLiter: number;
  readonly aluminumPhosphorusMolarRatio: number;
  readonly aluminumMolarMassGramsPerMol: number;
  readonly phosphorusMolarMassGramsPerMol: number;
  readonly reagentAluminumMassFraction: number;
}>;
export type Output = Readonly<{
  readonly candidatePhosphorusInactivationKg: number;
  readonly stoichiometricAluminumKg: number;
  readonly candidateReagentMassKg: number;
}>;
const inputFields = [
  {
    id: "labileSedimentPhosphorusKg",
    label: "Labile sediment phosphorus kg",
    kind: "number",
  },
  { id: "waterVolumeM3", label: "Water volume m3", kind: "number" },
  {
    id: "currentWaterPhosphorusMicrogramsPerLiter",
    label: "Current water phosphorus micrograms per liter",
    kind: "number",
  },
  {
    id: "targetWaterPhosphorusMicrogramsPerLiter",
    label: "Target water phosphorus micrograms per liter",
    kind: "number",
  },
  {
    id: "aluminumPhosphorusMolarRatio",
    label: "Aluminum phosphorus molar ratio",
    kind: "number",
  },
  {
    id: "aluminumMolarMassGramsPerMol",
    label: "Aluminum molar mass grams per mol",
    kind: "number",
  },
  {
    id: "phosphorusMolarMassGramsPerMol",
    label: "Phosphorus molar mass grams per mol",
    kind: "number",
  },
  {
    id: "reagentAluminumMassFraction",
    label: "Reagent aluminum mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.aluminumPhosphorusMolarRatio, "aluminumPhosphorusMolarRatio");
  positive(input.aluminumMolarMassGramsPerMol, "aluminumMolarMassGramsPerMol");
  positive(
    input.phosphorusMolarMassGramsPerMol,
    "phosphorusMolarMassGramsPerMol",
  );
  positive(input.reagentAluminumMassFraction, "reagentAluminumMassFraction");
  nonnegative(input.labileSedimentPhosphorusKg, "labileSedimentPhosphorusKg");
  nonnegative(input.waterVolumeM3, "waterVolumeM3");
  nonnegative(
    input.currentWaterPhosphorusMicrogramsPerLiter,
    "currentWaterPhosphorusMicrogramsPerLiter",
  );
  nonnegative(
    input.targetWaterPhosphorusMicrogramsPerLiter,
    "targetWaterPhosphorusMicrogramsPerLiter",
  );
  fraction(input.reagentAluminumMassFraction, "reagentAluminumMassFraction");
  const candidatePhosphorusInactivationKg =
      input.labileSedimentPhosphorusKg +
      (input.waterVolumeM3 *
        Math.max(
          0,
          input.currentWaterPhosphorusMicrogramsPerLiter -
            input.targetWaterPhosphorusMicrogramsPerLiter,
        )) /
        1000000,
    stoichiometricAluminumKg =
      (candidatePhosphorusInactivationKg *
        input.aluminumPhosphorusMolarRatio *
        input.aluminumMolarMassGramsPerMol) /
      input.phosphorusMolarMassGramsPerMol;
  return {
    candidatePhosphorusInactivationKg,
    stoichiometricAluminumKg,
    candidateReagentMassKg:
      stoichiometricAluminumKg / input.reagentAluminumMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  labileSedimentPhosphorusKg: 10,
  waterVolumeM3: 1000,
  currentWaterPhosphorusMicrogramsPerLiter: 30,
  targetWaterPhosphorusMicrogramsPerLiter: 10,
  aluminumPhosphorusMolarRatio: 2,
  aluminumMolarMassGramsPerMol: 27,
  phosphorusMolarMassGramsPerMol: 31,
  reagentAluminumMassFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  candidatePhosphorusInactivationKg: 10.02,
  stoichiometricAluminumKg: 17.454193548387096,
  candidateReagentMassKg: 174.541935483871,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/alum-dosing-phosphorus-inactivation",
  title: "Alum Dosing Phosphorus Inactivation",
  description:
    "Calculate candidate stoichiometric reagent mass for supplied water/sediment labile phosphorus and calibrated Al:P ratio; not dosing advice, and alkalinity, pH, toxicity, reagent hydration and delivery constraints need specialist assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "candidatePhosphorusInactivationKg",
      label: "Candidate phosphorus inactivation kg",
      kind: "number",
    },
    {
      id: "stoichiometricAluminumKg",
      label: "Stoichiometric aluminum kg",
      kind: "number",
    },
    {
      id: "candidateReagentMassKg",
      label: "Candidate reagent mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      labileSedimentPhosphorusKg: value.labileSedimentPhosphorusKg as number,
      waterVolumeM3: value.waterVolumeM3 as number,
      currentWaterPhosphorusMicrogramsPerLiter:
        value.currentWaterPhosphorusMicrogramsPerLiter as number,
      targetWaterPhosphorusMicrogramsPerLiter:
        value.targetWaterPhosphorusMicrogramsPerLiter as number,
      aluminumPhosphorusMolarRatio:
        value.aluminumPhosphorusMolarRatio as number,
      aluminumMolarMassGramsPerMol:
        value.aluminumMolarMassGramsPerMol as number,
      phosphorusMolarMassGramsPerMol:
        value.phosphorusMolarMassGramsPerMol as number,
      reagentAluminumMassFraction: value.reagentAluminumMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
