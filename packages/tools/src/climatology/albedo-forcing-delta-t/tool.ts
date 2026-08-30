import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly initialAlbedo: number;
  readonly changedAlbedo: number;
  readonly affectedGlobalAreaFraction: number;
  readonly meanIncidentSolarWPerM2: number;
  readonly callerTemperatureResponseKPerWPerM2: number;
}>;
export type Output = Readonly<{
  readonly globalMeanAbsorbedSolarChangeWPerM2: number;
  readonly calibratedEquilibriumTemperatureChangeK: number;
}>;
const inputFields = [
  { id: "initialAlbedo", label: "Initial albedo", kind: "number" },
  { id: "changedAlbedo", label: "Changed albedo", kind: "number" },
  {
    id: "affectedGlobalAreaFraction",
    label: "Affected global area fraction",
    kind: "number",
  },
  {
    id: "meanIncidentSolarWPerM2",
    label: "Mean incident solar w per m2",
    kind: "number",
  },
  {
    id: "callerTemperatureResponseKPerWPerM2",
    label: "Caller temperature response k per w per m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.meanIncidentSolarWPerM2, "meanIncidentSolarWPerM2");
  nonnegative(
    input.callerTemperatureResponseKPerWPerM2,
    "callerTemperatureResponseKPerWPerM2",
  );
  fraction(input.initialAlbedo, "initialAlbedo");
  fraction(input.changedAlbedo, "changedAlbedo");
  fraction(input.affectedGlobalAreaFraction, "affectedGlobalAreaFraction");
  const globalMeanAbsorbedSolarChangeWPerM2 =
    input.meanIncidentSolarWPerM2 *
    (input.initialAlbedo - input.changedAlbedo) *
    input.affectedGlobalAreaFraction;
  return {
    globalMeanAbsorbedSolarChangeWPerM2,
    calibratedEquilibriumTemperatureChangeK:
      globalMeanAbsorbedSolarChangeWPerM2 *
      input.callerTemperatureResponseKPerWPerM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialAlbedo: 0.2,
  changedAlbedo: 0.3,
  affectedGlobalAreaFraction: 0.5,
  meanIncidentSolarWPerM2: 100,
  callerTemperatureResponseKPerWPerM2: 0.5,
} satisfies Input;
export const exampleOutput = {
  globalMeanAbsorbedSolarChangeWPerM2: -5,
  calibratedEquilibriumTemperatureChangeK: -2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/albedo-forcing-delta-t",
  title: "Albedo Forcing Delta Temperature",
  description:
    "Apply caller area-weighted albedo perturbation to incident solar absorption and supplied equilibrium response; local/global incident-energy conventions must match and no climate feedbacks are inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "globalMeanAbsorbedSolarChangeWPerM2",
      label: "Global mean absorbed solar change w per m2",
      kind: "number",
    },
    {
      id: "calibratedEquilibriumTemperatureChangeK",
      label: "Calibrated equilibrium temperature change k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialAlbedo: value.initialAlbedo as number,
      changedAlbedo: value.changedAlbedo as number,
      affectedGlobalAreaFraction: value.affectedGlobalAreaFraction as number,
      meanIncidentSolarWPerM2: value.meanIncidentSolarWPerM2 as number,
      callerTemperatureResponseKPerWPerM2:
        value.callerTemperatureResponseKPerWPerM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
