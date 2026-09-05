import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly faultThrowM: number;
  readonly sourceShaleThicknessesM: readonly number[];
}>;
export type Output = Readonly<{
  readonly sourceShaleSmearFactors: readonly number[];
}>;
const inputFields = [
  { id: "faultThrowM", label: "Fault throw m", kind: "number" },
  {
    id: "sourceShaleThicknessesM",
    label: "Source shale thicknesses m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sourceShaleThicknessesM.forEach((v) =>
    positive(v, "sourceShaleThicknessesM"),
  );
  nonnegative(input.faultThrowM, "faultThrowM");
  if (!input.sourceShaleThicknessesM.length)
    simpleError("shale", "Explicit source-bed inventory.");
  return {
    sourceShaleSmearFactors: input.sourceShaleThicknessesM.map(
      (v) => input.faultThrowM / v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  faultThrowM: 20,
  sourceShaleThicknessesM: [2, 4],
} satisfies Input;
export const exampleOutput = {
  sourceShaleSmearFactors: [10, 5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/shale-smear-factor-ssf",
  title: "Geology Shale Smear Factor Ssf Calculator",
  description:
    "SSF throw/source-bed thickness separately for mapped shale beds; no predicted smear continuity or seal threshold. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "sourceShaleSmearFactors",
      label: "Source shale smear factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      faultThrowM: value.faultThrowM as number,
      sourceShaleThicknessesM:
        value.sourceShaleThicknessesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
