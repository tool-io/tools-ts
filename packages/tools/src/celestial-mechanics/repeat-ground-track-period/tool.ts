import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly planetRotationSeconds: number;
  readonly nodalPrecessionRadiansPerSecond: number;
  readonly planetRotations: number;
  readonly orbitRevolutions: number;
  readonly observedOrbitPeriodSeconds: number;
}>;
export type Output = Readonly<{
  readonly relativeRotationSeconds: number;
  readonly requiredOrbitPeriodSeconds: number;
  readonly periodMismatchSeconds: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.planetRotationSeconds, "planetRotationSeconds");
  count(input.planetRotations, "planetRotations", 1);
  count(input.orbitRevolutions, "orbitRevolutions", 1);
  positive(input.observedOrbitPeriodSeconds, "observedOrbitPeriodSeconds");
  const rate =
    (2 * Math.PI) / input.planetRotationSeconds -
    input.nodalPrecessionRadiansPerSecond;
  positive(rate, "nodalPrecessionRadiansPerSecond");
  const relativeRotationSeconds = (2 * Math.PI) / rate,
    requiredOrbitPeriodSeconds =
      (input.planetRotations * relativeRotationSeconds) /
      input.orbitRevolutions;
  return {
    relativeRotationSeconds,
    requiredOrbitPeriodSeconds,
    periodMismatchSeconds:
      input.observedOrbitPeriodSeconds - requiredOrbitPeriodSeconds,
  };
};
export const exampleInput = {
  planetRotationSeconds: 100,
  nodalPrecessionRadiansPerSecond: 0,
  planetRotations: 2,
  orbitRevolutions: 5,
  observedOrbitPeriodSeconds: 40,
} satisfies Input;
export const exampleOutput = {
  relativeRotationSeconds: 100,
  requiredOrbitPeriodSeconds: 40,
  periodMismatchSeconds: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/repeat-ground-track-period",
  title: "Repeat Ground Track Period",
  description:
    "Solve the node-relative repeat-ground-track period for supplied integer rotations and revolutions, including a supplied nodal drift.",
  inputs: [
    {
      id: "planetRotationSeconds",
      label: "Planet rotation seconds",
      kind: "number",
    },
    {
      id: "nodalPrecessionRadiansPerSecond",
      label: "Nodal precession radians per second",
      kind: "number",
    },
    { id: "planetRotations", label: "Planet rotations", kind: "integer" },
    { id: "orbitRevolutions", label: "Orbit revolutions", kind: "integer" },
    {
      id: "observedOrbitPeriodSeconds",
      label: "Observed orbit period seconds",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "relativeRotationSeconds",
      label: "Relative rotation seconds",
      kind: "number",
    },
    {
      id: "requiredOrbitPeriodSeconds",
      label: "Required orbit period seconds",
      kind: "number",
    },
    {
      id: "periodMismatchSeconds",
      label: "Period mismatch seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      planetRotationSeconds: value.planetRotationSeconds as number,
      nodalPrecessionRadiansPerSecond:
        value.nodalPrecessionRadiansPerSecond as number,
      planetRotations: value.planetRotations as number,
      orbitRevolutions: value.orbitRevolutions as number,
      observedOrbitPeriodSeconds: value.observedOrbitPeriodSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
