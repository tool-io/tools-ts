import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly originalWheelDiameterMm: number;
  readonly newWheelDiameterMm: number;
  readonly independentRollingResistanceLengthMm: number;
  readonly supportedNormalLoadN: number;
  readonly independentBearingDragN: number;
}>;
export type Output = Readonly<{
  readonly originalModeledPushN: number;
  readonly newModeledPushN: number;
  readonly modeledPushReductionFraction: number;
}>;
const inputFields = [
  {
    id: "originalWheelDiameterMm",
    label: "Original wheel diameter mm",
    kind: "number",
  },
  { id: "newWheelDiameterMm", label: "New wheel diameter mm", kind: "number" },
  {
    id: "independentRollingResistanceLengthMm",
    label: "Independent rolling resistance length mm",
    kind: "number",
  },
  {
    id: "supportedNormalLoadN",
    label: "Supported normal load n",
    kind: "number",
  },
  {
    id: "independentBearingDragN",
    label: "Independent bearing drag n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.originalWheelDiameterMm, "originalWheelDiameterMm");
  positive(input.newWheelDiameterMm, "newWheelDiameterMm");
  nonnegative(
    input.independentRollingResistanceLengthMm,
    "independentRollingResistanceLengthMm",
  );
  nonnegative(input.supportedNormalLoadN, "supportedNormalLoadN");
  nonnegative(input.independentBearingDragN, "independentBearingDragN");
  const a =
      (2 *
        input.independentRollingResistanceLengthMm *
        input.supportedNormalLoadN) /
        input.originalWheelDiameterMm +
      input.independentBearingDragN,
    b =
      (2 *
        input.independentRollingResistanceLengthMm *
        input.supportedNormalLoadN) /
        input.newWheelDiameterMm +
      input.independentBearingDragN;
  positive(a, "reference modeled force");
  return {
    originalModeledPushN: a,
    newModeledPushN: b,
    modeledPushReductionFraction: (a - b) / a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalWheelDiameterMm: 100,
  newWheelDiameterMm: 200,
  independentRollingResistanceLengthMm: 2,
  supportedNormalLoadN: 1000,
  independentBearingDragN: 10,
} satisfies Input;
export const exampleOutput = {
  originalModeledPushN: 50,
  newModeledPushN: 30,
  modeledPushReductionFraction: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/wheel-effort-reduction-factor",
  title: "Wheel Diameter Push Effort Reduction Factor Calculator",
  description:
    "Declared rolling moment model with independently measured length coefficient and separate bearing drag; larger wheels do not reduce all force proportionally. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "originalModeledPushN",
      label: "Original modeled push n",
      kind: "number",
    },
    { id: "newModeledPushN", label: "New modeled push n", kind: "number" },
    {
      id: "modeledPushReductionFraction",
      label: "Modeled push reduction fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      originalWheelDiameterMm: value.originalWheelDiameterMm as number,
      newWheelDiameterMm: value.newWheelDiameterMm as number,
      independentRollingResistanceLengthMm:
        value.independentRollingResistanceLengthMm as number,
      supportedNormalLoadN: value.supportedNormalLoadN as number,
      independentBearingDragN: value.independentBearingDragN as number,
    }),
});
export const run = tool.execute;
export default tool;
