import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedInitialWallMm: readonly number[];
  readonly observedFinalWallMm: readonly number[];
  readonly observedElapsedYears: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedObservedWallLossMmYear: readonly number[];
}>;
const inputFields = [
  {
    id: "observedInitialWallMm",
    label: "Observed initial wall mm",
    kind: "numberList",
  },
  {
    id: "observedFinalWallMm",
    label: "Observed final wall mm",
    kind: "numberList",
  },
  {
    id: "observedElapsedYears",
    label: "Observed elapsed years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInitialWallMm.forEach((v) =>
    positive(v, "observedInitialWallMm"),
  );
  input.observedFinalWallMm.forEach((v) => positive(v, "observedFinalWallMm"));
  input.observedElapsedYears.forEach((v) =>
    positive(v, "observedElapsedYears"),
  );
  aligned(
    input.observedInitialWallMm,
    input.observedFinalWallMm,
    "observedInitialWallMm",
  );
  aligned(
    input.observedInitialWallMm,
    input.observedElapsedYears,
    "observedInitialWallMm",
  );
  return {
    signedObservedWallLossMmYear: input.observedInitialWallMm.map(
      (v, i) =>
        (v - input.observedFinalWallMm[i]) / input.observedElapsedYears[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInitialWallMm: [5, 4],
  observedFinalWallMm: [4.8, 4.5],
  observedElapsedYears: [2, 1],
} satisfies Input;
export const exampleOutput = {
  signedObservedWallLossMmYear: [0.1, -0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-corrosion-rate",
  title: "Plumbing Pipe Corrosion Rate Calculator",
  description:
    "Audit actual matched wall-thickness changes per elapsed year, retaining apparent gains/measurement mismatch; not coupon mass-loss corrosion formula, remaining-life extrapolation or pressure integrity approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedObservedWallLossMmYear",
      label: "Signed observed wall loss mm year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInitialWallMm: value.observedInitialWallMm as readonly number[],
      observedFinalWallMm: value.observedFinalWallMm as readonly number[],
      observedElapsedYears: value.observedElapsedYears as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
