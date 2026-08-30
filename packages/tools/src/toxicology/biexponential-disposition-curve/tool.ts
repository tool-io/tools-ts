import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly amplitudeA: number;
  readonly amplitudeB: number;
  readonly alphaPerHour: number;
  readonly betaPerHour: number;
  readonly timesHours: readonly number[];
  readonly aucEndHours: number;
}>;
export type Output = Readonly<{
  readonly concentrations: readonly number[];
  readonly aucZeroToEnd: number;
  readonly aucZeroToInfinity: number;
}>;
const inputFields = [
  { id: "amplitudeA", label: "Amplitude a", kind: "number" },
  { id: "amplitudeB", label: "Amplitude b", kind: "number" },
  { id: "alphaPerHour", label: "Alpha per hour", kind: "number" },
  { id: "betaPerHour", label: "Beta per hour", kind: "number" },
  { id: "timesHours", label: "Times hours", kind: "numberList" },
  { id: "aucEndHours", label: "Auc end hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.amplitudeA, "amplitudeA");
  nonnegative(input.amplitudeB, "amplitudeB");
  positive(input.alphaPerHour, "alphaPerHour");
  positive(input.betaPerHour, "betaPerHour");
  if (input.alphaPerHour <= input.betaPerHour)
    simpleError(
      "alphaPerHour",
      "Distribution rate alpha must exceed terminal rate beta.",
    );
  if (!input.timesHours.length)
    simpleError("timesHours", "Nonempty observation times required.");
  input.timesHours.forEach((v) => nonnegative(v, "timesHours"));
  nonnegative(input.aucEndHours, "aucEndHours");
  return {
    concentrations: input.timesHours.map(
      (t) =>
        input.amplitudeA * Math.exp(-input.alphaPerHour * t) +
        input.amplitudeB * Math.exp(-input.betaPerHour * t),
    ),
    aucZeroToEnd:
      (-input.amplitudeA *
        Math.expm1(-input.alphaPerHour * input.aucEndHours)) /
        input.alphaPerHour -
      (input.amplitudeB * Math.expm1(-input.betaPerHour * input.aucEndHours)) /
        input.betaPerHour,
    aucZeroToInfinity:
      input.amplitudeA / input.alphaPerHour +
      input.amplitudeB / input.betaPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  amplitudeA: 8,
  amplitudeB: 2,
  alphaPerHour: 1,
  betaPerHour: 0.1,
  timesHours: [0, 1],
  aucEndHours: 1,
} satisfies Input;
export const exampleOutput = {
  concentrations: [10, 4.752710365443457],
  aucZeroToEnd: 6.960216109909271,
  aucZeroToInfinity: 28,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/biexponential-disposition-curve",
  title: "Two-Compartment Model",
  description:
    "Evaluate a supplied biexponential disposition curve and exact finite/infinite AUC; parameters are not fitted and no dose or clinical recommendation is generated.",
  inputs: inputFields,
  outputs: [
    { id: "concentrations", label: "Concentrations", kind: "numberList" },
    { id: "aucZeroToEnd", label: "Auc zero to end", kind: "number" },
    { id: "aucZeroToInfinity", label: "Auc zero to infinity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      amplitudeA: value.amplitudeA as number,
      amplitudeB: value.amplitudeB as number,
      alphaPerHour: value.alphaPerHour as number,
      betaPerHour: value.betaPerHour as number,
      timesHours: value.timesHours as readonly number[],
      aucEndHours: value.aucEndHours as number,
    }),
});
export const run = tool.execute;
export default tool;
