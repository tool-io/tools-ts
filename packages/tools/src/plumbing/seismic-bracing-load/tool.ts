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
  fraction,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSupportedAssemblyMassKg: readonly number[];
  readonly callerDesignAccelerationMetersSecondSquared: number;
  readonly callerBraceLoadSharingFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerModeledTotalSeismicForceN: number;
  readonly callerAllocatedBraceForcesN: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSupportedAssemblyMassKg",
    label: "Observed supported assembly mass kg",
    kind: "numberList",
  },
  {
    id: "callerDesignAccelerationMetersSecondSquared",
    label: "Caller design acceleration meters second squared",
    kind: "number",
  },
  {
    id: "callerBraceLoadSharingFractions",
    label: "Caller brace load sharing fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSupportedAssemblyMassKg.forEach((v) =>
    nonnegative(v, "observedSupportedAssemblyMassKg"),
  );
  nonnegative(
    input.callerDesignAccelerationMetersSecondSquared,
    "callerDesignAccelerationMetersSecondSquared",
  );
  input.callerBraceLoadSharingFractions.forEach((v) =>
    fraction(v, "callerBraceLoadSharingFractions"),
  );
  const shares = sum(input.callerBraceLoadSharingFractions);
  if (Math.abs(shares - 1) > 1e-8)
    simpleError("shares", "Independent brace load fractions must sum to one.");
  const total =
    sum(input.observedSupportedAssemblyMassKg) *
    input.callerDesignAccelerationMetersSecondSquared;
  return {
    callerModeledTotalSeismicForceN: total,
    callerAllocatedBraceForcesN: input.callerBraceLoadSharingFractions.map(
      (v) => v * total,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSupportedAssemblyMassKg: [10, 20],
  callerDesignAccelerationMetersSecondSquared: 5,
  callerBraceLoadSharingFractions: [0.6, 0.4],
} satisfies Input;
export const exampleOutput = {
  callerModeledTotalSeismicForceN: 150,
  callerAllocatedBraceForcesN: [90, 60],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/seismic-bracing-load",
  title: "Plumbing Seismic Bracing Load Calculator",
  description:
    "Allocate actual assembly mass/inertial demand using independently established design acceleration and brace fractions; no inferred seismic zone/load factors, rigid-body compatibility or safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledTotalSeismicForceN",
      label: "Caller modeled total seismic force n",
      kind: "number",
    },
    {
      id: "callerAllocatedBraceForcesN",
      label: "Caller allocated brace forces n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSupportedAssemblyMassKg:
        value.observedSupportedAssemblyMassKg as readonly number[],
      callerDesignAccelerationMetersSecondSquared:
        value.callerDesignAccelerationMetersSecondSquared as number,
      callerBraceLoadSharingFractions:
        value.callerBraceLoadSharingFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
