import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, circular } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly azimuthDegrees: readonly number[];
  readonly observationWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly circularMeanDegrees: number;
  readonly resultantConcentration: number;
}>;
const inputFields = [
  { id: "azimuthDegrees", label: "Azimuth degrees", kind: "numberList" },
  {
    id: "observationWeights",
    label: "Observation weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return circular(input.azimuthDegrees, input.observationWeights);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  azimuthDegrees: [350, 10],
  observationWeights: [1, 1],
} satisfies Input;
export const exampleOutput = {
  circularMeanDegrees: 0,
  resultantConcentration: 0.984807753012208,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/paleocurrent-direction",
  title: "Geology Paleocurrent Direction Calculator",
  description:
    "Weighted circular mean of independently tilt-corrected directional paleocurrent measurements; canceling resultant rejected. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "circularMeanDegrees",
      label: "Circular mean degrees",
      kind: "number",
    },
    {
      id: "resultantConcentration",
      label: "Resultant concentration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      azimuthDegrees: value.azimuthDegrees as readonly number[],
      observationWeights: value.observationWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
