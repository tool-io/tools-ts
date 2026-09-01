import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFittingHeadLossesM: readonly number[];
  readonly observedMatchedVelocityMSecond: readonly number[];
  readonly callerGravityMetersSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly observedInferredFittingK: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFittingHeadLossesM",
    label: "Observed fitting head losses m",
    kind: "numberList",
  },
  {
    id: "observedMatchedVelocityMSecond",
    label: "Observed matched velocity m second",
    kind: "numberList",
  },
  {
    id: "callerGravityMetersSecondSquared",
    label: "Caller gravity meters second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedVelocityMSecond.forEach((v) =>
    positive(v, "observedMatchedVelocityMSecond"),
  );
  positive(
    input.callerGravityMetersSecondSquared,
    "callerGravityMetersSecondSquared",
  );
  input.observedFittingHeadLossesM.forEach((v) =>
    nonnegative(v, "observedFittingHeadLossesM"),
  );
  aligned(
    input.observedFittingHeadLossesM,
    input.observedMatchedVelocityMSecond,
    "observedFittingHeadLossesM",
  );
  return {
    observedInferredFittingK: input.observedFittingHeadLossesM.map(
      (v, i) =>
        (2 * input.callerGravityMetersSecondSquared * v) /
        input.observedMatchedVelocityMSecond[i] ** 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFittingHeadLossesM: [0.5, 1],
  observedMatchedVelocityMSecond: [2, 4],
  callerGravityMetersSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  observedInferredFittingK: [2.5, 1.25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/minor-loss-coefficient-k",
  title: "Plumbing Minor Loss Coefficient K Calculator",
  description:
    "Infer actual measured fitting K from matched head loss and reference velocity, not catalog equivalent lengths or pipe Darcy friction; no pressure tap bias correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedInferredFittingK",
      label: "Observed inferred fitting k",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFittingHeadLossesM:
        value.observedFittingHeadLossesM as readonly number[],
      observedMatchedVelocityMSecond:
        value.observedMatchedVelocityMSecond as readonly number[],
      callerGravityMetersSecondSquared:
        value.callerGravityMetersSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
