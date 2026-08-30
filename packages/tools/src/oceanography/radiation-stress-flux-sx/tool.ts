import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly waveHeightM: number;
  readonly waterDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly groupToPhaseSpeedRatio: number;
  readonly angleFromShoreNormalDegrees: number;
}>;
export type Output = Readonly<{
  readonly waveEnergyJPerM2: number;
  readonly shoreNormalRadiationStressNPerM: number;
  readonly longshoreRadiationStressNPerM: number;
}>;
const inputFields = [
  { id: "waveHeightM", label: "Wave height m", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "groupToPhaseSpeedRatio",
    label: "Group to phase speed ratio",
    kind: "number",
  },
  {
    id: "angleFromShoreNormalDegrees",
    label: "Angle from shore normal degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(input.waveHeightM, "waveHeightM");
  fraction(input.groupToPhaseSpeedRatio, "groupToPhaseSpeedRatio");
  if (
    input.groupToPhaseSpeedRatio < 0.5 ||
    Math.abs(input.angleFromShoreNormalDegrees) >= 90
  )
    simpleError(
      "waveState",
      "Linear-wave n within [0.5,1] and shoreward angle within (-90,90) required.",
    );
  const e =
      (input.waterDensityKgPerM3 *
        input.gravityMPerSecondSquared *
        input.waveHeightM ** 2) /
      8,
    a = (input.angleFromShoreNormalDegrees * Math.PI) / 180,
    n = input.groupToPhaseSpeedRatio;
  return {
    waveEnergyJPerM2: e,
    shoreNormalRadiationStressNPerM: e * (n * (1 + Math.cos(a) ** 2) - 0.5),
    longshoreRadiationStressNPerM: e * n * Math.sin(a) * Math.cos(a),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waveHeightM: 2,
  waterDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
  groupToPhaseSpeedRatio: 0.5,
  angleFromShoreNormalDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  waveEnergyJPerM2: 5000,
  shoreNormalRadiationStressNPerM: 2500,
  longshoreRadiationStressNPerM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/radiation-stress-flux-sx",
  title: "Radiation Stress Flux SX",
  description:
    "Compute monochromatic linear-wave shore-normal and cross radiation stresses with caller group/phase ratio and incident angle; no surf-zone closure is assumed.",
  inputs: inputFields,
  outputs: [
    { id: "waveEnergyJPerM2", label: "Wave energy j per m2", kind: "number" },
    {
      id: "shoreNormalRadiationStressNPerM",
      label: "Shore normal radiation stress n per m",
      kind: "number",
    },
    {
      id: "longshoreRadiationStressNPerM",
      label: "Longshore radiation stress n per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waveHeightM: value.waveHeightM as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      groupToPhaseSpeedRatio: value.groupToPhaseSpeedRatio as number,
      angleFromShoreNormalDegrees: value.angleFromShoreNormalDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
