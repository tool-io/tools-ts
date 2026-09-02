import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDoorThicknessMm: readonly number[];
  readonly observedAlreadyBoredHingeDepthMm: readonly number[];
  readonly callerVerifiedMinimumResidualDoorWebMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedResidualDoorWebMm: readonly number[];
  readonly signedDoorWebMarginMm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDoorThicknessMm",
    label: "Observed door thickness mm",
    kind: "numberList",
  },
  {
    id: "observedAlreadyBoredHingeDepthMm",
    label: "Observed already bored hinge depth mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMinimumResidualDoorWebMm",
    label: "Caller verified minimum residual door web mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDoorThicknessMm.forEach((v) =>
    positive(v, "observedDoorThicknessMm"),
  );
  input.observedAlreadyBoredHingeDepthMm.forEach((v) =>
    nonnegative(v, "observedAlreadyBoredHingeDepthMm"),
  );
  input.callerVerifiedMinimumResidualDoorWebMm.forEach((v) =>
    nonnegative(v, "callerVerifiedMinimumResidualDoorWebMm"),
  );
  aligned(
    input.observedDoorThicknessMm,
    input.observedAlreadyBoredHingeDepthMm,
    "observedDoorThicknessMm",
  );
  aligned(
    input.observedDoorThicknessMm,
    input.callerVerifiedMinimumResidualDoorWebMm,
    "observedDoorThicknessMm",
  );
  const web = input.observedDoorThicknessMm.map(
    (v, i) => v - input.observedAlreadyBoredHingeDepthMm[i],
  );
  return {
    observedResidualDoorWebMm: web,
    signedDoorWebMarginMm: web.map(
      (v, i) => v - input.callerVerifiedMinimumResidualDoorWebMm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDoorThicknessMm: [20, 25],
  observedAlreadyBoredHingeDepthMm: [12, 20],
  callerVerifiedMinimumResidualDoorWebMm: [5, 6],
} satisfies Input;
export const exampleOutput = {
  observedResidualDoorWebMm: [8, 5],
  signedDoorWebMarginMm: [3, -1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/door-hinge-boring-depth",
  title: "Door Hinge Boring Depth Calculator",
  description:
    "Audit actual already bored hinge depth/door stock and independently established residual web, breakthrough stays signed; not cup geometry lookup or drilling depth prescription. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedResidualDoorWebMm",
      label: "Observed residual door web mm",
      kind: "numberList",
    },
    {
      id: "signedDoorWebMarginMm",
      label: "Signed door web margin mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDoorThicknessMm:
        value.observedDoorThicknessMm as readonly number[],
      observedAlreadyBoredHingeDepthMm:
        value.observedAlreadyBoredHingeDepthMm as readonly number[],
      callerVerifiedMinimumResidualDoorWebMm:
        value.callerVerifiedMinimumResidualDoorWebMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
