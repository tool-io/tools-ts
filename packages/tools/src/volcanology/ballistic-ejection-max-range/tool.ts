import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly ejectionSpeedMPerSecond: number;
  readonly launchHeightAboveImpactPlaneM: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly maximumVacuumRangeM: number;
  readonly optimalLaunchAngleDegrees: number;
}>;
const inputFields = [
  {
    id: "ejectionSpeedMPerSecond",
    label: "Ejection speed m per second",
    kind: "number",
  },
  {
    id: "launchHeightAboveImpactPlaneM",
    label: "Launch height above impact plane m",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ejectionSpeedMPerSecond, "ejectionSpeedMPerSecond");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(
    input.launchHeightAboveImpactPlaneM,
    "launchHeightAboveImpactPlaneM",
  );
  const v = input.ejectionSpeedMPerSecond,
    d = Math.hypot(
      v,
      Math.sqrt(
        2 *
          input.gravityMPerSecondSquared *
          input.launchHeightAboveImpactPlaneM,
      ),
    );
  return {
    maximumVacuumRangeM: (v * d) / input.gravityMPerSecondSquared,
    optimalLaunchAngleDegrees: (Math.atan(v / d) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ejectionSpeedMPerSecond: 10,
  launchHeightAboveImpactPlaneM: 5,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  maximumVacuumRangeM: 14.142135623730951,
  optimalLaunchAngleDegrees: 35.264389682754654,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/ballistic-ejection-max-range",
  title: "Ballistic Ejection Max Range",
  description:
    "Optimize vacuum ballistic range over launch angle onto a lower horizontal impact plane; distinct from existing fixed-angle/equal-level projectile motion, and aerodynamic drag/terrain or safe distances are not predicted.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumVacuumRangeM",
      label: "Maximum vacuum range m",
      kind: "number",
    },
    {
      id: "optimalLaunchAngleDegrees",
      label: "Optimal launch angle degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ejectionSpeedMPerSecond: value.ejectionSpeedMPerSecond as number,
      launchHeightAboveImpactPlaneM:
        value.launchHeightAboveImpactPlaneM as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
