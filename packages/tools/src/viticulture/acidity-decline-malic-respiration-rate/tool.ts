import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationDays: readonly number[];
  readonly malicConcentrationsGramsPerLiter: readonly number[];
  readonly sampleJuiceVolumesLiters: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedMalicPoolMassesGrams: readonly number[];
  readonly fittedApparentMalicPoolDecayPerDay: number;
  readonly fittedConcentrationDecayPerDay: number;
}>;
const inputFields = [
  { id: "observationDays", label: "Observation days", kind: "numberList" },
  {
    id: "malicConcentrationsGramsPerLiter",
    label: "Malic concentrations grams per liter",
    kind: "numberList",
  },
  {
    id: "sampleJuiceVolumesLiters",
    label: "Sample juice volumes liters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.malicConcentrationsGramsPerLiter.forEach((v) =>
    positive(v, "malicConcentrationsGramsPerLiter"),
  );
  input.sampleJuiceVolumesLiters.forEach((v) =>
    positive(v, "sampleJuiceVolumesLiters"),
  );
  aligned(
    input.observationDays,
    input.malicConcentrationsGramsPerLiter,
    "observationDays",
  );
  aligned(
    input.observationDays,
    input.sampleJuiceVolumesLiters,
    "observationDays",
  );
  ordered(input.observationDays, "days");
  const observedMalicPoolMassesGrams =
      input.malicConcentrationsGramsPerLiter.map((v, i) =>
        positive(v * input.sampleJuiceVolumesLiters[i], "poolMass"),
      ),
    mass = regression(
      input.observationDays,
      observedMalicPoolMassesGrams.map(Math.log),
    ),
    conc = regression(
      input.observationDays,
      input.malicConcentrationsGramsPerLiter.map(Math.log),
    );
  return {
    observedMalicPoolMassesGrams,
    fittedApparentMalicPoolDecayPerDay: -mass.slope,
    fittedConcentrationDecayPerDay: -conc.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationDays: [0, 1, 2],
  malicConcentrationsGramsPerLiter: [4, 2, 1],
  sampleJuiceVolumesLiters: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  observedMalicPoolMassesGrams: [4, 2, 1],
  fittedApparentMalicPoolDecayPerDay: 0.6931471805599453,
  fittedConcentrationDecayPerDay: 0.6931471805599453,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/acidity-decline-malic-respiration-rate",
  title: "Acidity Decline Malic Respiration Rate",
  description:
    "Fit signed log-linear malic mass-pool and concentration decline separately from actual sample volume, retaining apparent increase; observational loss is not proof of respiration, dilution or metabolic mechanism.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMalicPoolMassesGrams",
      label: "Observed malic pool masses grams",
      kind: "numberList",
    },
    {
      id: "fittedApparentMalicPoolDecayPerDay",
      label: "Fitted apparent malic pool decay per day",
      kind: "number",
    },
    {
      id: "fittedConcentrationDecayPerDay",
      label: "Fitted concentration decay per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observationDays: value.observationDays as readonly number[],
      malicConcentrationsGramsPerLiter:
        value.malicConcentrationsGramsPerLiter as readonly number[],
      sampleJuiceVolumesLiters:
        value.sampleJuiceVolumesLiters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
