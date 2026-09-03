import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedEnding: string;
  readonly callerVerifiedEndings: readonly string[];
  readonly callerVerifiedParadigmLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedEnding", label: "Observed ending", kind: "string" },
  {
    id: "callerVerifiedEndings",
    label: "Caller verified endings",
    kind: "stringList",
  },
  {
    id: "callerVerifiedParadigmLabels",
    label: "Caller verified paradigm labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.callerVerifiedEndings,
    input.callerVerifiedParadigmLabels,
    "paradigm",
  );
  if (
    !input.observedEnding ||
    input.callerVerifiedEndings.some((v) => !v) ||
    input.callerVerifiedParadigmLabels.some((v) => !v.trim())
  )
    simpleError(
      "endings",
      "Independently verified exact endings/paradigm labels, including macrons where material.",
    );
  return {
    possibleParadigmLabels: input.callerVerifiedParadigmLabels.filter(
      (_, i) => input.callerVerifiedEndings[i] === input.observedEnding,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedEnding: "ae",
    callerVerifiedEndings: ["ae", "ae", "am"],
    callerVerifiedParadigmLabels: [
      "first/genitive/singular",
      "first/nominative/plural",
      "first/accusative/singular",
    ],
  },
  output: {
    result: {
      possibleParadigmLabels: [
        "first/genitive/singular",
        "first/nominative/plural",
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/latin-declension-case-ending-identifier",
  title: "Latin Declension Case Ending Identifier",
  description:
    "Return all exact caller paradigm matches for an observed Latin ending, retaining case/number ambiguity; no stem recognition, dialect or lexeme inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
