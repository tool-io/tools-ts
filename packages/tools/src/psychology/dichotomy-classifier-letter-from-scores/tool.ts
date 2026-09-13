import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFirstDichotomyScores: readonly number[];
  readonly actualSecondDichotomyScores: readonly number[];
  readonly firstLetterLabels: readonly string[];
  readonly secondLetterLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFirstDichotomyScores",
    label: "Actual first dichotomy scores",
    kind: "numberList",
  },
  {
    id: "actualSecondDichotomyScores",
    label: "Actual second dichotomy scores",
    kind: "numberList",
  },
  { id: "firstLetterLabels", label: "First letter labels", kind: "stringList" },
  {
    id: "secondLetterLabels",
    label: "Second letter labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualFirstDichotomyScores,
    input.actualSecondDichotomyScores,
    "scores",
  );
  aligned(input.actualFirstDichotomyScores, input.firstLetterLabels, "labels");
  aligned(input.actualFirstDichotomyScores, input.secondLetterLabels, "labels");
  if (
    !input.firstLetterLabels.length ||
    [...input.firstLetterLabels, ...input.secondLetterLabels].some(
      (v) => !v.trim(),
    )
  )
    simpleError("labels", "Actual non blank criterion labels.");
  return {
    selectedLetterOrTieCodes: input.actualFirstDichotomyScores.map((v, i) =>
      v > input.actualSecondDichotomyScores[i]
        ? input.firstLetterLabels[i]
        : v < input.actualSecondDichotomyScores[i]
          ? input.secondLetterLabels[i]
          : input.firstLetterLabels[i] + "/" + input.secondLetterLabels[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFirstDichotomyScores: [1, 3],
    actualSecondDichotomyScores: [2, 3],
    firstLetterLabels: ["E", "T"],
    secondLetterLabels: ["I", "F"],
  },
  output: { result: { selectedLetterOrTieCodes: ["I", "T/F"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/dichotomy-classifier-letter-from-scores",
  title: "Type Letter Dichotomy Classifier",
  description:
    "Pure paired score letter comparison, ties retained; caller established dichotomy instrument not psychological identity diagnosis or a licensed personality algorithm.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
