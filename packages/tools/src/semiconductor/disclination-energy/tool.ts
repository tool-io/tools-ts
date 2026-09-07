import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerDisclinationAngularStrengthRadians: number;
  readonly callerShearModulusPa: number;
  readonly callerPoissonRatio: number;
  readonly observedOuterRadiusM: number;
  readonly observedCoreRadiusM: number;
  readonly observedLineLengthM: number;
}>;
export type Output = Readonly<{
  readonly idealWedgeDisclinationEnergyJ: number;
}>;
const inputFields = [
  {
    id: "callerDisclinationAngularStrengthRadians",
    label: "Caller disclination angular strength radians",
    kind: "number",
  },
  {
    id: "callerShearModulusPa",
    label: "Caller shear modulus pa",
    kind: "number",
  },
  { id: "callerPoissonRatio", label: "Caller poisson ratio", kind: "number" },
  {
    id: "observedOuterRadiusM",
    label: "Observed outer radius m",
    kind: "number",
  },
  {
    id: "observedCoreRadiusM",
    label: "Observed core radius m",
    kind: "number",
  },
  {
    id: "observedLineLengthM",
    label: "Observed line length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerShearModulusPa, "callerShearModulusPa");
  positive(input.observedOuterRadiusM, "observedOuterRadiusM");
  positive(input.observedCoreRadiusM, "observedCoreRadiusM");
  positive(input.observedLineLengthM, "observedLineLengthM");
  if (
    input.callerPoissonRatio <= -1 ||
    input.callerPoissonRatio >= 0.5 ||
    input.observedCoreRadiusM >= input.observedOuterRadiusM
  )
    simpleError(
      "branch",
      "Stable isotropic ν∈(−1,.5) and outer>core radius required.",
    );
  return {
    idealWedgeDisclinationEnergyJ:
      (input.callerShearModulusPa *
        input.callerDisclinationAngularStrengthRadians ** 2 *
        (input.observedOuterRadiusM ** 2 - input.observedCoreRadiusM ** 2) *
        input.observedLineLengthM) /
      (16 * Math.PI * (1 - input.callerPoissonRatio)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDisclinationAngularStrengthRadians: 0.1,
  callerShearModulusPa: 100,
  callerPoissonRatio: 0.25,
  observedOuterRadiusM: 2,
  observedCoreRadiusM: 1,
  observedLineLengthM: 3,
} satisfies Input;
export const exampleOutput = {
  idealWedgeDisclinationEnergyJ: 0.238732414637843,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/disclination-energy",
  title: "Semiconductor Disclination Energy Calculator",
  description:
    "Explicit ideal wedge-disclination continuum convention μΩ²(R²−rc²) L/[16π(1−ν)], ignores core and free-boundary corrections; not logarithmic dislocation line-energy model.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealWedgeDisclinationEnergyJ",
      label: "Ideal wedge disclination energy j",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDisclinationAngularStrengthRadians:
        value.callerDisclinationAngularStrengthRadians as number,
      callerShearModulusPa: value.callerShearModulusPa as number,
      callerPoissonRatio: value.callerPoissonRatio as number,
      observedOuterRadiusM: value.observedOuterRadiusM as number,
      observedCoreRadiusM: value.observedCoreRadiusM as number,
      observedLineLengthM: value.observedLineLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
