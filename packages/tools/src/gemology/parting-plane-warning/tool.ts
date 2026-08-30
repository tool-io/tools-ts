import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, shape, unit } from "../shared.js";
export type Input = Readonly<{
  readonly measuredPartingPlaneNormals: readonly (readonly number[])[];
  readonly proposedCutPlaneNormal: readonly number[];
  readonly callerParallelismToleranceDegrees: number;
}>;
export type Output = Readonly<{
  readonly acutePartingCutAnglesDegrees: readonly number[];
  readonly nearParallelPartingPlaneFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredPartingPlaneNormals",
    label: "Measured parting plane normals",
    kind: "matrix",
  },
  {
    id: "proposedCutPlaneNormal",
    label: "Proposed cut plane normal",
    kind: "numberList",
  },
  {
    id: "callerParallelismToleranceDegrees",
    label: "Caller parallelism tolerance degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerParallelismToleranceDegrees,
    "callerParallelismToleranceDegrees",
  );
  if (
    input.callerParallelismToleranceDegrees > 90 ||
    shape(input.measuredPartingPlaneNormals, "parting") !== 3
  )
    simpleError(
      "planes",
      "Three-component planes and acute tolerance required.",
    );
  const cut = unit(input.proposedCutPlaneNormal, "cut"),
    angles = input.measuredPartingPlaneNormals.map((v) => {
      const n = unit(v, "parting");
      return (
        (Math.acos(
          Math.min(1, Math.abs(n.reduce((s, x, i) => s + x * cut[i], 0))),
        ) *
          180) /
        Math.PI
      );
    });
  return {
    acutePartingCutAnglesDegrees: angles,
    nearParallelPartingPlaneFlags: angles.map((v) =>
      v <= input.callerParallelismToleranceDegrees ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredPartingPlaneNormals: [
    [1, 0, 0],
    [0, 1, 0],
  ],
  proposedCutPlaneNormal: [-1, 0, 0],
  callerParallelismToleranceDegrees: 5,
} satisfies Input;
export const exampleOutput = {
  acutePartingCutAnglesDegrees: [0, 90],
  nearParallelPartingPlaneFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/parting-plane-warning",
  title: "Parting Plane Warning Checker",
  description:
    "Compare measured parting-plane normals to declared cut-plane normal with sign-invariant acute angles; parallelism warning is geometry only, not cleavage probability or safe cutting advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "acutePartingCutAnglesDegrees",
      label: "Acute parting cut angles degrees",
      kind: "numberList",
    },
    {
      id: "nearParallelPartingPlaneFlags",
      label: "Near parallel parting plane flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredPartingPlaneNormals:
        value.measuredPartingPlaneNormals as readonly (readonly number[])[],
      proposedCutPlaneNormal: value.proposedCutPlaneNormal as readonly number[],
      callerParallelismToleranceDegrees:
        value.callerParallelismToleranceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
