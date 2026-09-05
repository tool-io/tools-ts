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
  sum,
  solve,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerSequentialNormAllocationMatrix: readonly (readonly number[])[];
  readonly observedOxideMoles: readonly number[];
  readonly callerNormMineralMolarMasses: readonly number[];
}>;
export type Output = Readonly<{
  readonly normMineralMasses: readonly number[];
  readonly signedOxideClosureResiduals: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSequentialNormAllocationMatrix",
    label: "Caller sequential norm allocation matrix",
    kind: "matrix",
  },
  {
    id: "observedOxideMoles",
    label: "Observed oxide moles",
    kind: "numberList",
  },
  {
    id: "callerNormMineralMolarMasses",
    label: "Caller norm mineral molar masses",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerNormMineralMolarMasses.forEach((v) =>
    positive(v, "callerNormMineralMolarMasses"),
  );
  input.observedOxideMoles.forEach((v) => nonnegative(v, "observedOxideMoles"));
  const a = input.callerSequentialNormAllocationMatrix;
  if (
    a.length !== input.observedOxideMoles.length ||
    a.length !== input.callerNormMineralMolarMasses.length
  )
    simpleError(
      "allocation",
      "Full square independently verified CIPW branch stoichiometric allocation,≤32 species.",
    );
  const m = solve(a, input.observedOxideMoles);
  m.forEach((v) => nonnegative(v, "admissible normative branch moles"));
  return {
    normMineralMasses: m.map(
      (v, i) => v * input.callerNormMineralMolarMasses[i],
    ),
    signedOxideClosureResiduals: a.map(
      (r, i) => sum(r.map((v, j) => v * m[j])) - input.observedOxideMoles[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSequentialNormAllocationMatrix: [
    [1, 0],
    [0, 1],
  ],
  observedOxideMoles: [2, 3],
  callerNormMineralMolarMasses: [10, 20],
} satisfies Input;
export const exampleOutput = {
  normMineralMasses: [20, 60],
  signedOxideClosureResiduals: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/cipw-norm-calculation-full",
  title: "Geology Cipw Norm Calculation Full Calculator",
  description:
    "Solve full caller independently selected CIPW sequential branch oxide/mineral stoichiometric balance; caller establishes oxidation, volatile removal and normative phases. Not an automatic branch selector or modal mineral identity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "normMineralMasses",
      label: "Norm mineral masses",
      kind: "numberList",
    },
    {
      id: "signedOxideClosureResiduals",
      label: "Signed oxide closure residuals",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSequentialNormAllocationMatrix:
        value.callerSequentialNormAllocationMatrix as readonly (readonly number[])[],
      observedOxideMoles: value.observedOxideMoles as readonly number[],
      callerNormMineralMolarMasses:
        value.callerNormMineralMolarMasses as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
