import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly adjacentBedNormalSpacingsM: readonly number[];
  readonly observedBendAnglesRadians: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedFlexuralSlipsM: readonly number[];
}>;
const inputFields = [
  {
    id: "adjacentBedNormalSpacingsM",
    label: "Adjacent bed normal spacings m",
    kind: "numberList",
  },
  {
    id: "observedBendAnglesRadians",
    label: "Observed bend angles radians",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.adjacentBedNormalSpacingsM.forEach((v) =>
    positive(v, "adjacentBedNormalSpacingsM"),
  );
  aligned(
    input.adjacentBedNormalSpacingsM,
    input.observedBendAnglesRadians,
    "adjacentBedNormalSpacingsM",
  );
  input.observedBendAnglesRadians.forEach((v) => {
    if (Math.abs(v) > Math.PI) simpleError("angle", "Explicit signed bend≤π.");
  });
  return {
    signedFlexuralSlipsM: input.adjacentBedNormalSpacingsM.map(
      (v, i) => v * input.observedBendAnglesRadians[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  adjacentBedNormalSpacingsM: [1, 2],
  observedBendAnglesRadians: [0.5, -0.25],
} satisfies Input;
export const exampleOutput = {
  signedFlexuralSlipsM: [0.5, -0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/flexural-slip-restoration",
  title: "Geology Flexural Slip Restoration Calculator",
  description:
    "Concentric flexural-slip h×signed bend radians across independently matched adjacent beds; orientation and slip sign retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFlexuralSlipsM",
      label: "Signed flexural slips m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      adjacentBedNormalSpacingsM:
        value.adjacentBedNormalSpacingsM as readonly number[],
      observedBendAnglesRadians:
        value.observedBendAnglesRadians as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
