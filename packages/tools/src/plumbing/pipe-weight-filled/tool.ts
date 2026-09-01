import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPipeLengthsM: readonly number[];
  readonly callerVerifiedEmptyPipeMassKgM: readonly number[];
  readonly measuredInternalVolumesLitersM: readonly number[];
  readonly callerFillFractions: readonly number[];
  readonly callerFluidDensityKgLiter: number;
}>;
export type Output = Readonly<{
  readonly modeledFilledSegmentMassKg: readonly number[];
  readonly totalModeledFilledPipeMassKg: number;
}>;
const inputFields = [
  {
    id: "observedPipeLengthsM",
    label: "Observed pipe lengths m",
    kind: "numberList",
  },
  {
    id: "callerVerifiedEmptyPipeMassKgM",
    label: "Caller verified empty pipe mass kg m",
    kind: "numberList",
  },
  {
    id: "measuredInternalVolumesLitersM",
    label: "Measured internal volumes liters m",
    kind: "numberList",
  },
  {
    id: "callerFillFractions",
    label: "Caller fill fractions",
    kind: "numberList",
  },
  {
    id: "callerFluidDensityKgLiter",
    label: "Caller fluid density kg liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerFluidDensityKgLiter, "callerFluidDensityKgLiter");
  input.observedPipeLengthsM.forEach((v) =>
    nonnegative(v, "observedPipeLengthsM"),
  );
  input.callerVerifiedEmptyPipeMassKgM.forEach((v) =>
    nonnegative(v, "callerVerifiedEmptyPipeMassKgM"),
  );
  input.measuredInternalVolumesLitersM.forEach((v) =>
    nonnegative(v, "measuredInternalVolumesLitersM"),
  );
  input.callerFillFractions.forEach((v) => fraction(v, "callerFillFractions"));
  aligned(
    input.observedPipeLengthsM,
    input.callerVerifiedEmptyPipeMassKgM,
    "observedPipeLengthsM",
  );
  aligned(
    input.observedPipeLengthsM,
    input.measuredInternalVolumesLitersM,
    "observedPipeLengthsM",
  );
  aligned(
    input.observedPipeLengthsM,
    input.callerFillFractions,
    "observedPipeLengthsM",
  );
  const masses = input.observedPipeLengthsM.map(
    (v, i) =>
      v *
      (input.callerVerifiedEmptyPipeMassKgM[i] +
        input.measuredInternalVolumesLitersM[i] *
          input.callerFillFractions[i] *
          input.callerFluidDensityKgLiter),
  );
  return {
    modeledFilledSegmentMassKg: masses,
    totalModeledFilledPipeMassKg: sum(masses),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPipeLengthsM: [2, 3],
  callerVerifiedEmptyPipeMassKgM: [1, 2],
  measuredInternalVolumesLitersM: [0.5, 1],
  callerFillFractions: [1, 0.5],
  callerFluidDensityKgLiter: 1,
} satisfies Input;
export const exampleOutput = {
  modeledFilledSegmentMassKg: [3, 7.5],
  totalModeledFilledPipeMassKg: 10.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-weight-filled",
  title: "Plumbing Pipe Weight Filled Calculator",
  description:
    "Reconcile actual heterogeneous segment dry pipe mass and independently measured fluid volume/fill inventory; not nominal diameter shell weight or generic hanger tributary allocation.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledFilledSegmentMassKg",
      label: "Modeled filled segment mass kg",
      kind: "numberList",
    },
    {
      id: "totalModeledFilledPipeMassKg",
      label: "Total modeled filled pipe mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPipeLengthsM: value.observedPipeLengthsM as readonly number[],
      callerVerifiedEmptyPipeMassKgM:
        value.callerVerifiedEmptyPipeMassKgM as readonly number[],
      measuredInternalVolumesLitersM:
        value.measuredInternalVolumesLitersM as readonly number[],
      callerFillFractions: value.callerFillFractions as readonly number[],
      callerFluidDensityKgLiter: value.callerFluidDensityKgLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
