import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, shape, unit } from "../shared.js";
export type Input = Readonly<{
  readonly appliedSymmetricStressTensorPa: readonly (readonly number[])[];
  readonly measuredCleavagePlaneNormals: readonly (readonly number[])[];
  readonly callerTensileTractionLimitPa: number;
}>;
export type Output = Readonly<{
  readonly planeNormalTractionsPa: readonly number[];
  readonly aboveCallerTensileTractionFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "appliedSymmetricStressTensorPa",
    label: "Applied symmetric stress tensor pa",
    kind: "matrix",
  },
  {
    id: "measuredCleavagePlaneNormals",
    label: "Measured cleavage plane normals",
    kind: "matrix",
  },
  {
    id: "callerTensileTractionLimitPa",
    label: "Caller tensile traction limit pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerTensileTractionLimitPa,
    "callerTensileTractionLimitPa",
  );
  const s = input.appliedSymmetricStressTensorPa;
  if (
    shape(s, "stress") !== 3 ||
    s.length !== 3 ||
    s.some((r, i) => r.some((v, j) => v !== s[j][i]))
  )
    simpleError(
      "stress",
      "Symmetric 3x3 applied Cartesian stress tensor required.",
    );
  if (shape(input.measuredCleavagePlaneNormals, "normals") !== 3)
    simpleError("normals", "Three-component plane normals required.");
  const planeNormalTractionsPa = input.measuredCleavagePlaneNormals.map(
    (row) => {
      const n = unit(row, "normal");
      return n.reduce(
        (sum, a, i) => sum + a * s[i].reduce((t, b, j) => t + b * n[j], 0),
        0,
      );
    },
  );
  return {
    planeNormalTractionsPa,
    aboveCallerTensileTractionFlags: planeNormalTractionsPa.map((v) =>
      v > input.callerTensileTractionLimitPa ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  appliedSymmetricStressTensorPa: [
    [10, 0, 0],
    [0, -5, 0],
    [0, 0, 0],
  ],
  measuredCleavagePlaneNormals: [
    [1, 0, 0],
    [0, 1, 0],
  ],
  callerTensileTractionLimitPa: 8,
} satisfies Input;
export const exampleOutput = {
  planeNormalTractionsPa: [10, -5],
  aboveCallerTensileTractionFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/cleavage-risk-checker",
  title: "Cleavage Direction Risk Checker",
  description:
    "Resolve signed normal traction on independently measured cleavage planes under caller applied stress/tensile limit; compressive traction remains negative and this idealized screen does not predict fracture or handling safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "planeNormalTractionsPa",
      label: "Plane normal tractions pa",
      kind: "numberList",
    },
    {
      id: "aboveCallerTensileTractionFlags",
      label: "Above caller tensile traction flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      appliedSymmetricStressTensorPa:
        value.appliedSymmetricStressTensorPa as readonly (readonly number[])[],
      measuredCleavagePlaneNormals:
        value.measuredCleavagePlaneNormals as readonly (readonly number[])[],
      callerTensileTractionLimitPa:
        value.callerTensileTractionLimitPa as number,
    }),
});
export const run = tool.execute;
export default tool;
