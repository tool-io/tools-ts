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
  readonly flowM3PerHour: number;
  readonly solidsLoadKgPerHour: number;
  readonly calibratedHydraulicFluxM3PerM2Hour: number;
  readonly calibratedSolidsFluxKgPerM2Hour: number;
  readonly availableDutyFraction: number;
}>;
export type Output = Readonly<{
  readonly hydraulicAreaM2: number;
  readonly solidsAreaM2: number;
  readonly installedEffectiveAreaM2: number;
}>;
const inputFields = [
  { id: "flowM3PerHour", label: "Flow m3 per hour", kind: "number" },
  {
    id: "solidsLoadKgPerHour",
    label: "Solids load kg per hour",
    kind: "number",
  },
  {
    id: "calibratedHydraulicFluxM3PerM2Hour",
    label: "Calibrated hydraulic flux m3 per m2 hour",
    kind: "number",
  },
  {
    id: "calibratedSolidsFluxKgPerM2Hour",
    label: "Calibrated solids flux kg per m2 hour",
    kind: "number",
  },
  {
    id: "availableDutyFraction",
    label: "Available duty fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.calibratedHydraulicFluxM3PerM2Hour,
    "calibratedHydraulicFluxM3PerM2Hour",
  );
  positive(
    input.calibratedSolidsFluxKgPerM2Hour,
    "calibratedSolidsFluxKgPerM2Hour",
  );
  positive(input.availableDutyFraction, "availableDutyFraction");
  nonnegative(input.flowM3PerHour, "flowM3PerHour");
  nonnegative(input.solidsLoadKgPerHour, "solidsLoadKgPerHour");
  fraction(input.availableDutyFraction, "availableDutyFraction");
  const hydraulicAreaM2 =
      input.flowM3PerHour / input.calibratedHydraulicFluxM3PerM2Hour,
    solidsAreaM2 =
      input.solidsLoadKgPerHour / input.calibratedSolidsFluxKgPerM2Hour;
  return {
    hydraulicAreaM2,
    solidsAreaM2,
    installedEffectiveAreaM2:
      Math.max(hydraulicAreaM2, solidsAreaM2) / input.availableDutyFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flowM3PerHour: 100,
  solidsLoadKgPerHour: 20,
  calibratedHydraulicFluxM3PerM2Hour: 50,
  calibratedSolidsFluxKgPerM2Hour: 5,
  availableDutyFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  hydraulicAreaM2: 2,
  solidsAreaM2: 4,
  installedEffectiveAreaM2: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/drum-filter-sizing",
  title: "Drum Filter Sizing",
  description:
    "Size effective drum-filter area from calibrated hydraulic/solids fluxes and available duty; backwashing, mesh capture and vendor ratings are supplied externally.",
  inputs: inputFields,
  outputs: [
    { id: "hydraulicAreaM2", label: "Hydraulic area m2", kind: "number" },
    { id: "solidsAreaM2", label: "Solids area m2", kind: "number" },
    {
      id: "installedEffectiveAreaM2",
      label: "Installed effective area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      flowM3PerHour: value.flowM3PerHour as number,
      solidsLoadKgPerHour: value.solidsLoadKgPerHour as number,
      calibratedHydraulicFluxM3PerM2Hour:
        value.calibratedHydraulicFluxM3PerM2Hour as number,
      calibratedSolidsFluxKgPerM2Hour:
        value.calibratedSolidsFluxKgPerM2Hour as number,
      availableDutyFraction: value.availableDutyFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
