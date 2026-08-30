import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly characteristicThicknessM: number;
  readonly terminusBalanceMetersIcePerYear: number;
  readonly elapsedYears: number;
  readonly initialLengthAnomalyM: number;
  readonly equilibriumLengthAnomalyM: number;
}>;
export type Output = Readonly<{
  readonly responseTimeYears: number;
  readonly predictedLengthAnomalyM: number;
}>;
const inputFields = [
  {
    id: "characteristicThicknessM",
    label: "Characteristic thickness m",
    kind: "number",
  },
  {
    id: "terminusBalanceMetersIcePerYear",
    label: "Terminus balance meters ice per year",
    kind: "number",
  },
  { id: "elapsedYears", label: "Elapsed years", kind: "number" },
  {
    id: "initialLengthAnomalyM",
    label: "Initial length anomaly m",
    kind: "number",
  },
  {
    id: "equilibriumLengthAnomalyM",
    label: "Equilibrium length anomaly m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.characteristicThicknessM, "characteristicThicknessM");
  nonnegative(input.elapsedYears, "elapsedYears");
  if (input.terminusBalanceMetersIcePerYear >= 0)
    simpleError(
      "terminusBalanceMetersIcePerYear",
      "Negative ice-equivalent terminus balance required.",
    );
  const responseTimeYears =
    input.characteristicThicknessM / -input.terminusBalanceMetersIcePerYear;
  return {
    responseTimeYears,
    predictedLengthAnomalyM:
      input.equilibriumLengthAnomalyM +
      (input.initialLengthAnomalyM - input.equilibriumLengthAnomalyM) *
        Math.exp(-input.elapsedYears / responseTimeYears),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  characteristicThicknessM: 100,
  terminusBalanceMetersIcePerYear: -5,
  elapsedYears: 20,
  initialLengthAnomalyM: 100,
  equilibriumLengthAnomalyM: 0,
} satisfies Input;
export const exampleOutput = {
  responseTimeYears: 20,
  predictedLengthAnomalyM: 36.787944117144235,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/glacier-response-time-johannesson",
  title: "Glacier Response Time Johannesson",
  description:
    "Use Johannesson thickness/terminus-ablation response time with a linear exponential length-anomaly relaxation; no geometry-dependent higher-order response is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "responseTimeYears", label: "Response time years", kind: "number" },
    {
      id: "predictedLengthAnomalyM",
      label: "Predicted length anomaly m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      characteristicThicknessM: value.characteristicThicknessM as number,
      terminusBalanceMetersIcePerYear:
        value.terminusBalanceMetersIcePerYear as number,
      elapsedYears: value.elapsedYears as number,
      initialLengthAnomalyM: value.initialLengthAnomalyM as number,
      equilibriumLengthAnomalyM: value.equilibriumLengthAnomalyM as number,
    }),
});
export const run = tool.execute;
export default tool;
