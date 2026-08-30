import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly betaPerMeterSecond: number;
  readonly deformationRadiusM: number;
  readonly zonalWaveNumberPerM: number;
  readonly meridionalWaveNumberPerM: number;
}>;
export type Output = Readonly<{
  readonly zonalPhaseSpeedMPerSecond: number;
  readonly angularFrequencyPerSecond: number;
}>;
const inputFields = [
  { id: "betaPerMeterSecond", label: "Beta per meter second", kind: "number" },
  { id: "deformationRadiusM", label: "Deformation radius m", kind: "number" },
  {
    id: "zonalWaveNumberPerM",
    label: "Zonal wave number per m",
    kind: "number",
  },
  {
    id: "meridionalWaveNumberPerM",
    label: "Meridional wave number per m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.betaPerMeterSecond, "betaPerMeterSecond");
  positive(input.deformationRadiusM, "deformationRadiusM");
  const zonalPhaseSpeedMPerSecond =
    -input.betaPerMeterSecond /
    (input.zonalWaveNumberPerM ** 2 +
      input.meridionalWaveNumberPerM ** 2 +
      1 / input.deformationRadiusM ** 2);
  return {
    zonalPhaseSpeedMPerSecond,
    angularFrequencyPerSecond:
      zonalPhaseSpeedMPerSecond * input.zonalWaveNumberPerM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  betaPerMeterSecond: 0.001,
  deformationRadiusM: 10,
  zonalWaveNumberPerM: 0.1,
  meridionalWaveNumberPerM: 0,
} satisfies Input;
export const exampleOutput = {
  zonalPhaseSpeedMPerSecond: -0.05,
  angularFrequencyPerSecond: -0.005,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/baroclinic-rossby-wave-speed",
  title: "Baroclinic Rossby Wave Speed",
  description:
    "Calculate dispersive beta-plane baroclinic Rossby-wave phase/frequency from supplied deformation radius and wave numbers; distinct from an existing lake deformation-radius inversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "zonalPhaseSpeedMPerSecond",
      label: "Zonal phase speed m per second",
      kind: "number",
    },
    {
      id: "angularFrequencyPerSecond",
      label: "Angular frequency per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      betaPerMeterSecond: value.betaPerMeterSecond as number,
      deformationRadiusM: value.deformationRadiusM as number,
      zonalWaveNumberPerM: value.zonalWaveNumberPerM as number,
      meridionalWaveNumberPerM: value.meridionalWaveNumberPerM as number,
    }),
});
export const run = tool.execute;
export default tool;
