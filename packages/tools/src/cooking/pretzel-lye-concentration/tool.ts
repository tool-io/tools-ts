import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  ordered,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyPreparedBathMassG: number;
  readonly independentlyAssayedLyeMassG: number;
  readonly callerVerifiedBathFractionLower: number;
  readonly callerVerifiedBathFractionUpper: number;
}>;
export type Output = Readonly<{
  readonly observedBathLyeMassFraction: number;
  readonly signedCallerConcentrationMargin: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyPreparedBathMassG",
    label: "Observed already prepared bath mass g",
    kind: "number",
  },
  {
    id: "independentlyAssayedLyeMassG",
    label: "Independently assayed lye mass g",
    kind: "number",
  },
  {
    id: "callerVerifiedBathFractionLower",
    label: "Caller verified bath fraction lower",
    kind: "number",
  },
  {
    id: "callerVerifiedBathFractionUpper",
    label: "Caller verified bath fraction upper",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedAlreadyPreparedBathMassG,
    "observedAlreadyPreparedBathMassG",
  );
  nonnegative(
    input.independentlyAssayedLyeMassG,
    "independentlyAssayedLyeMassG",
  );
  fraction(
    input.callerVerifiedBathFractionLower,
    "callerVerifiedBathFractionLower",
  );
  fraction(
    input.callerVerifiedBathFractionUpper,
    "callerVerifiedBathFractionUpper",
  );
  ordered(
    input.callerVerifiedBathFractionLower,
    input.callerVerifiedBathFractionUpper,
  );
  const f =
    input.independentlyAssayedLyeMassG / input.observedAlreadyPreparedBathMassG;
  fraction(f, "observed concentration");
  return {
    observedBathLyeMassFraction: f,
    signedCallerConcentrationMargin: Math.min(
      f - input.callerVerifiedBathFractionLower,
      input.callerVerifiedBathFractionUpper - f,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyPreparedBathMassG: 1000,
  independentlyAssayedLyeMassG: 10,
  callerVerifiedBathFractionLower: 0.005,
  callerVerifiedBathFractionUpper: 0.02,
} satisfies Input;
export const exampleOutput = {
  observedBathLyeMassFraction: 0.01,
  signedCallerConcentrationMargin: 0.005,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/pretzel-lye-concentration",
  title: "Cooking Pretzel Lye Concentration Calculator",
  description:
    "Audit independently assayed ALREADY prepared pretzel bath against independently verified caller concentration notice; no caustic mixing recipe, handling instruction or food/process-safety recommendation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBathLyeMassFraction",
      label: "Observed bath lye mass fraction",
      kind: "number",
    },
    {
      id: "signedCallerConcentrationMargin",
      label: "Signed caller concentration margin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyPreparedBathMassG:
        value.observedAlreadyPreparedBathMassG as number,
      independentlyAssayedLyeMassG:
        value.independentlyAssayedLyeMassG as number,
      callerVerifiedBathFractionLower:
        value.callerVerifiedBathFractionLower as number,
      callerVerifiedBathFractionUpper:
        value.callerVerifiedBathFractionUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
