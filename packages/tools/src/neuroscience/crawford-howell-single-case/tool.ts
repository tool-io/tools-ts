import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, mean, variance } from "../shared.js";
export type Input = Readonly<{
  readonly caseScore: number;
  readonly controlScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly controlMean: number;
  readonly controlSampleSd: number;
  readonly tValue: number;
  readonly degreesOfFreedom: number;
}>;
const inputFields = [
  { id: "caseScore", label: "Case score", kind: "number" },
  { id: "controlScores", label: "Control scores", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.controlScores.length < 2)
    simpleError("controlScores", "At least two controls required.");
  const controlMean = mean(input.controlScores),
    controlSampleSd = positive(
      Math.sqrt(variance(input.controlScores)),
      "controlScores",
    ),
    tValue =
      (input.caseScore - controlMean) /
      (controlSampleSd *
        Math.sqrt(
          (input.controlScores.length + 1) / input.controlScores.length,
        ));
  return {
    controlMean,
    controlSampleSd,
    tValue,
    degreesOfFreedom: input.controlScores.length - 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  caseScore: 20,
  controlScores: [8, 10, 12],
} satisfies Input;
export const exampleOutput = {
  controlMean: 10,
  controlSampleSd: 2,
  tValue: 4.330127018922194,
  degreesOfFreedom: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/crawford-howell-single-case",
  title: "Crawford-Howell t",
  description:
    "Compare one case with a small normative control sample using Crawford–Howell t and n−1 degrees of freedom; no p-value, tail choice or clinical interpretation is invented.",
  inputs: inputFields,
  outputs: [
    { id: "controlMean", label: "Control mean", kind: "number" },
    { id: "controlSampleSd", label: "Control sample sd", kind: "number" },
    { id: "tValue", label: "T value", kind: "number" },
    { id: "degreesOfFreedom", label: "Degrees of freedom", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      caseScore: value.caseScore as number,
      controlScores: value.controlScores as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
