import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly radialCoordinatesM: readonly number[];
  readonly axisymmetricDownwardDisplacementsM: readonly number[];
}>;
export type Output = Readonly<{ readonly axisymmetricBowlVolumeM3: number }>;
const inputFields = [
  {
    id: "radialCoordinatesM",
    label: "Radial coordinates m",
    kind: "numberList",
  },
  {
    id: "axisymmetricDownwardDisplacementsM",
    label: "Axisymmetric downward displacements m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.radialCoordinatesM.forEach((v) => nonnegative(v, "radialCoordinatesM"));
  input.axisymmetricDownwardDisplacementsM.forEach((v) =>
    nonnegative(v, "axisymmetricDownwardDisplacementsM"),
  );
  aligned(
    input.radialCoordinatesM,
    input.axisymmetricDownwardDisplacementsM,
    "radialCoordinatesM",
  );
  strictlyIncreasing(input.radialCoordinatesM, "radii");
  if (
    input.radialCoordinatesM[0] !== 0 ||
    input.axisymmetricDownwardDisplacementsM.at(-1) !== 0
  )
    simpleError("coverage", "Profile from axis to observed zero edge.");
  return {
    axisymmetricBowlVolumeM3:
      2 *
      Math.PI *
      sum(
        input.radialCoordinatesM.slice(1).map((b, i) => {
          const a = input.radialCoordinatesM[i],
            u = input.axisymmetricDownwardDisplacementsM[i],
            v = input.axisymmetricDownwardDisplacementsM[i + 1];
          return ((b - a) * (u * (2 * a + b) + v * (a + 2 * b))) / 6;
        }),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  radialCoordinatesM: [0, 1, 2],
  axisymmetricDownwardDisplacementsM: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  axisymmetricBowlVolumeM3: 7.330382858376184,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/subsidence-bowl-volume",
  title: "Geology Subsidence Bowl Volume Calculator",
  description:
    "Exact integral2πr×piecewise-linear measured subsidence profile, explicit axisymmetry and observed zero edge; unlike depth×footprint. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "axisymmetricBowlVolumeM3",
      label: "Axisymmetric bowl volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      radialCoordinatesM: value.radialCoordinatesM as readonly number[],
      axisymmetricDownwardDisplacementsM:
        value.axisymmetricDownwardDisplacementsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
