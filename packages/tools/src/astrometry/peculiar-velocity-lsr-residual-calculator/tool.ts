import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, vector3 } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedHeliocentricUvwKmPerSecond: readonly number[];
  readonly callerSolarMotionUvwKmPerSecond: readonly number[];
  readonly callerReferenceLsrUvwKmPerSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly residualUvwKmPerSecond: readonly number[];
  readonly peculiarSpeedKmPerSecond: number;
}>;
const inputFields = [
  {
    id: "observedHeliocentricUvwKmPerSecond",
    label: "Observed heliocentric uvw km per second",
    kind: "numberList",
  },
  {
    id: "callerSolarMotionUvwKmPerSecond",
    label: "Caller solar motion uvw km per second",
    kind: "numberList",
  },
  {
    id: "callerReferenceLsrUvwKmPerSecond",
    label: "Caller reference lsr uvw km per second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  vector3(input.observedHeliocentricUvwKmPerSecond, "observed");
  vector3(input.callerSolarMotionUvwKmPerSecond, "solar");
  vector3(input.callerReferenceLsrUvwKmPerSecond, "reference");
  const r = input.observedHeliocentricUvwKmPerSecond.map(
    (v, i) =>
      v +
      input.callerSolarMotionUvwKmPerSecond[i] -
      input.callerReferenceLsrUvwKmPerSecond[i],
  );
  return {
    residualUvwKmPerSecond: r,
    peculiarSpeedKmPerSecond: Math.hypot(...r),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHeliocentricUvwKmPerSecond: [10, 20, 30],
  callerSolarMotionUvwKmPerSecond: [1, 2, 3],
  callerReferenceLsrUvwKmPerSecond: [0, 5, 0],
} satisfies Input;
export const exampleOutput = {
  residualUvwKmPerSecond: [11, 17, 33],
  peculiarSpeedKmPerSecond: 38.71692136521188,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/peculiar-velocity-lsr-residual-calculator",
  title: "Peculiar Velocity versus Local Standard of Rest Residual Calculator",
  description:
    "Add independent solar motion to already consistently oriented heliocentric UVW then subtract caller LSR reference; no automatic coordinate transform or Galactic orbit. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "residualUvwKmPerSecond",
      label: "Residual uvw km per second",
      kind: "numberList",
    },
    {
      id: "peculiarSpeedKmPerSecond",
      label: "Peculiar speed km per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHeliocentricUvwKmPerSecond:
        value.observedHeliocentricUvwKmPerSecond as readonly number[],
      callerSolarMotionUvwKmPerSecond:
        value.callerSolarMotionUvwKmPerSecond as readonly number[],
      callerReferenceLsrUvwKmPerSecond:
        value.callerReferenceLsrUvwKmPerSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
