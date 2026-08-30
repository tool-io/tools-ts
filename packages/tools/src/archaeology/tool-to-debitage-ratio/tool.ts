import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly toolCountsByContext: readonly number[];
  readonly debitageCountsByContext: readonly number[];
  readonly toolDetectionProbabilities: readonly number[];
  readonly debitageDetectionProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly adjustedToolCount: number;
  readonly adjustedDebitageCount: number;
  readonly adjustedToolDebitageRatio: number;
}>;
const inputFields = [
  {
    id: "toolCountsByContext",
    label: "Tool counts by context",
    kind: "numberList",
  },
  {
    id: "debitageCountsByContext",
    label: "Debitage counts by context",
    kind: "numberList",
  },
  {
    id: "toolDetectionProbabilities",
    label: "Tool detection probabilities",
    kind: "numberList",
  },
  {
    id: "debitageDetectionProbabilities",
    label: "Debitage detection probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.toolDetectionProbabilities.forEach((v) =>
    positive(v, "toolDetectionProbabilities"),
  );
  input.debitageDetectionProbabilities.forEach((v) =>
    positive(v, "debitageDetectionProbabilities"),
  );
  input.toolDetectionProbabilities.forEach((v) =>
    fraction(v, "toolDetectionProbabilities"),
  );
  input.debitageDetectionProbabilities.forEach((v) =>
    fraction(v, "debitageDetectionProbabilities"),
  );
  input.toolCountsByContext.forEach((v) => count(v, "toolCountsByContext"));
  input.debitageCountsByContext.forEach((v) =>
    count(v, "debitageCountsByContext"),
  );
  aligned(
    input.toolCountsByContext,
    input.debitageCountsByContext,
    "toolCountsByContext",
  );
  aligned(
    input.toolCountsByContext,
    input.toolDetectionProbabilities,
    "toolCountsByContext",
  );
  aligned(
    input.toolCountsByContext,
    input.debitageDetectionProbabilities,
    "toolCountsByContext",
  );
  const adjustedToolCount = input.toolCountsByContext.reduce(
      (s, v, i) => s + v / input.toolDetectionProbabilities[i],
      0,
    ),
    adjustedDebitageCount = positive(
      input.debitageCountsByContext.reduce(
        (s, v, i) => s + v / input.debitageDetectionProbabilities[i],
        0,
      ),
      "debitageCountsByContext",
    );
  return {
    adjustedToolCount,
    adjustedDebitageCount,
    adjustedToolDebitageRatio: adjustedToolCount / adjustedDebitageCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  toolCountsByContext: [5, 10],
  debitageCountsByContext: [10, 10],
  toolDetectionProbabilities: [0.5, 1],
  debitageDetectionProbabilities: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  adjustedToolCount: 20,
  adjustedDebitageCount: 30,
  adjustedToolDebitageRatio: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/tool-to-debitage-ratio",
  title: "Tool to Debitage Ratio",
  description:
    "Compare pooled tool/debitage counts corrected with distinct caller recovery probabilities by context; no functional site classification or uncorrected ratio alias.",
  inputs: inputFields,
  outputs: [
    { id: "adjustedToolCount", label: "Adjusted tool count", kind: "number" },
    {
      id: "adjustedDebitageCount",
      label: "Adjusted debitage count",
      kind: "number",
    },
    {
      id: "adjustedToolDebitageRatio",
      label: "Adjusted tool debitage ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      toolCountsByContext: value.toolCountsByContext as readonly number[],
      debitageCountsByContext:
        value.debitageCountsByContext as readonly number[],
      toolDetectionProbabilities:
        value.toolDetectionProbabilities as readonly number[],
      debitageDetectionProbabilities:
        value.debitageDetectionProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
