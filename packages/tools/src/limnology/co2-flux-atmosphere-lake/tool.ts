import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly dissolvedCo2MolesPerM3: number;
  readonly atmosphericCo2PartialPressurePa: number;
  readonly henryMolesPerM3Pa: number;
  readonly pistonVelocityMPerDay: number;
  readonly lakeAreaM2: number;
  readonly co2MolarMassGramsPerMole: number;
}>;
export type Output = Readonly<{
  readonly equilibriumCo2MolesPerM3: number;
  readonly signedCo2FluxMolesPerM2Day: number;
  readonly signedLakeCo2KgPerDay: number;
}>;
const inputFields = [
  {
    id: "dissolvedCo2MolesPerM3",
    label: "Dissolved co2 moles per m3",
    kind: "number",
  },
  {
    id: "atmosphericCo2PartialPressurePa",
    label: "Atmospheric co2 partial pressure pa",
    kind: "number",
  },
  { id: "henryMolesPerM3Pa", label: "Henry moles per m3 pa", kind: "number" },
  {
    id: "pistonVelocityMPerDay",
    label: "Piston velocity m per day",
    kind: "number",
  },
  { id: "lakeAreaM2", label: "Lake area m2", kind: "number" },
  {
    id: "co2MolarMassGramsPerMole",
    label: "Co2 molar mass grams per mole",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.henryMolesPerM3Pa, "henryMolesPerM3Pa");
  positive(input.lakeAreaM2, "lakeAreaM2");
  positive(input.co2MolarMassGramsPerMole, "co2MolarMassGramsPerMole");
  nonnegative(input.dissolvedCo2MolesPerM3, "dissolvedCo2MolesPerM3");
  nonnegative(
    input.atmosphericCo2PartialPressurePa,
    "atmosphericCo2PartialPressurePa",
  );
  nonnegative(input.pistonVelocityMPerDay, "pistonVelocityMPerDay");
  const equilibriumCo2MolesPerM3 =
      input.henryMolesPerM3Pa * input.atmosphericCo2PartialPressurePa,
    signedCo2FluxMolesPerM2Day =
      input.pistonVelocityMPerDay *
      (input.dissolvedCo2MolesPerM3 - equilibriumCo2MolesPerM3);
  return {
    equilibriumCo2MolesPerM3,
    signedCo2FluxMolesPerM2Day,
    signedLakeCo2KgPerDay:
      (signedCo2FluxMolesPerM2Day *
        input.lakeAreaM2 *
        input.co2MolarMassGramsPerMole) /
      1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dissolvedCo2MolesPerM3: 12,
  atmosphericCo2PartialPressurePa: 100,
  henryMolesPerM3Pa: 0.1,
  pistonVelocityMPerDay: 0.5,
  lakeAreaM2: 100,
  co2MolarMassGramsPerMole: 44,
} satisfies Input;
export const exampleOutput = {
  equilibriumCo2MolesPerM3: 10,
  signedCo2FluxMolesPerM2Day: 1,
  signedLakeCo2KgPerDay: 4.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/co2-flux-atmosphere-lake",
  title: "CO2 Flux Atmosphere Lake",
  description:
    "Combine a caller Henry equilibrium with measured dissolved CO2 and piston velocity into signed atmosphere–lake flux; positive is emission, negative uptake, and carbonate speciation is external.",
  inputs: inputFields,
  outputs: [
    {
      id: "equilibriumCo2MolesPerM3",
      label: "Equilibrium co2 moles per m3",
      kind: "number",
    },
    {
      id: "signedCo2FluxMolesPerM2Day",
      label: "Signed co2 flux moles per m2 day",
      kind: "number",
    },
    {
      id: "signedLakeCo2KgPerDay",
      label: "Signed lake co2 kg per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dissolvedCo2MolesPerM3: value.dissolvedCo2MolesPerM3 as number,
      atmosphericCo2PartialPressurePa:
        value.atmosphericCo2PartialPressurePa as number,
      henryMolesPerM3Pa: value.henryMolesPerM3Pa as number,
      pistonVelocityMPerDay: value.pistonVelocityMPerDay as number,
      lakeAreaM2: value.lakeAreaM2 as number,
      co2MolarMassGramsPerMole: value.co2MolarMassGramsPerMole as number,
    }),
});
export const run = tool.execute;
export default tool;
