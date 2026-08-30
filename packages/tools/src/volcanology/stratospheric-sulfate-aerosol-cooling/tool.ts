import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly stratosphericSo2MassKg: number;
  readonly sulfateMassYieldPerSo2Mass: number;
  readonly aerosolMassExtinctionM2PerKg: number;
  readonly representedAtmosphericAreaM2: number;
  readonly elapsedDays: number;
  readonly aerosolEFoldingLifetimeDays: number;
  readonly forcingWattsPerM2PerOpticalDepth: number;
  readonly temperatureResponseKPerWattsM2: number;
}>;
export type Output = Readonly<{
  readonly modelAerosolOpticalDepth: number;
  readonly modelRadiativeForcingWattsPerM2: number;
  readonly equilibriumResponseScenarioK: number;
}>;
const inputFields = [
  {
    id: "stratosphericSo2MassKg",
    label: "Stratospheric so2 mass kg",
    kind: "number",
  },
  {
    id: "sulfateMassYieldPerSo2Mass",
    label: "Sulfate mass yield per so2 mass",
    kind: "number",
  },
  {
    id: "aerosolMassExtinctionM2PerKg",
    label: "Aerosol mass extinction m2 per kg",
    kind: "number",
  },
  {
    id: "representedAtmosphericAreaM2",
    label: "Represented atmospheric area m2",
    kind: "number",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "number" },
  {
    id: "aerosolEFoldingLifetimeDays",
    label: "Aerosol e folding lifetime days",
    kind: "number",
  },
  {
    id: "forcingWattsPerM2PerOpticalDepth",
    label: "Forcing watts per m2 per optical depth",
    kind: "number",
  },
  {
    id: "temperatureResponseKPerWattsM2",
    label: "Temperature response k per watts m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sulfateMassYieldPerSo2Mass, "sulfateMassYieldPerSo2Mass");
  positive(input.aerosolMassExtinctionM2PerKg, "aerosolMassExtinctionM2PerKg");
  positive(input.representedAtmosphericAreaM2, "representedAtmosphericAreaM2");
  positive(input.aerosolEFoldingLifetimeDays, "aerosolEFoldingLifetimeDays");
  nonnegative(input.stratosphericSo2MassKg, "stratosphericSo2MassKg");
  nonnegative(input.elapsedDays, "elapsedDays");
  nonnegative(
    input.temperatureResponseKPerWattsM2,
    "temperatureResponseKPerWattsM2",
  );
  const modelAerosolOpticalDepth =
      ((input.stratosphericSo2MassKg *
        input.sulfateMassYieldPerSo2Mass *
        input.aerosolMassExtinctionM2PerKg) /
        input.representedAtmosphericAreaM2) *
      Math.exp(-input.elapsedDays / input.aerosolEFoldingLifetimeDays),
    modelRadiativeForcingWattsPerM2 =
      modelAerosolOpticalDepth * input.forcingWattsPerM2PerOpticalDepth;
  return {
    modelAerosolOpticalDepth,
    modelRadiativeForcingWattsPerM2,
    equilibriumResponseScenarioK:
      modelRadiativeForcingWattsPerM2 * input.temperatureResponseKPerWattsM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stratosphericSo2MassKg: 1000,
  sulfateMassYieldPerSo2Mass: 1.5,
  aerosolMassExtinctionM2PerKg: 100,
  representedAtmosphericAreaM2: 1000000,
  elapsedDays: 10,
  aerosolEFoldingLifetimeDays: 10,
  forcingWattsPerM2PerOpticalDepth: -20,
  temperatureResponseKPerWattsM2: 0.5,
} satisfies Input;
export const exampleOutput = {
  modelAerosolOpticalDepth: 0.05518191617571635,
  modelRadiativeForcingWattsPerM2: -1.103638323514327,
  equilibriumResponseScenarioK: -0.5518191617571635,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/stratospheric-sulfate-aerosol-cooling",
  title: "Stratospheric Sulfate Aerosol Cooling Estimator",
  description:
    "Screen sulfate optical depth, signed forcing and equilibrium temperature-response scenario with supplied yield/lifetime/area/calibration; not a transient climate forecast, global default coefficient or geoengineering recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelAerosolOpticalDepth",
      label: "Model aerosol optical depth",
      kind: "number",
    },
    {
      id: "modelRadiativeForcingWattsPerM2",
      label: "Model radiative forcing watts per m2",
      kind: "number",
    },
    {
      id: "equilibriumResponseScenarioK",
      label: "Equilibrium response scenario k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stratosphericSo2MassKg: value.stratosphericSo2MassKg as number,
      sulfateMassYieldPerSo2Mass: value.sulfateMassYieldPerSo2Mass as number,
      aerosolMassExtinctionM2PerKg:
        value.aerosolMassExtinctionM2PerKg as number,
      representedAtmosphericAreaM2:
        value.representedAtmosphericAreaM2 as number,
      elapsedDays: value.elapsedDays as number,
      aerosolEFoldingLifetimeDays: value.aerosolEFoldingLifetimeDays as number,
      forcingWattsPerM2PerOpticalDepth:
        value.forcingWattsPerM2PerOpticalDepth as number,
      temperatureResponseKPerWattsM2:
        value.temperatureResponseKPerWattsM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
