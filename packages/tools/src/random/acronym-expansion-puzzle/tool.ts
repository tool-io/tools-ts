import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import { validateRandomInput, finish, corpus } from "../batch42-shared.js";
import base from "../../text/acronym/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateInputsJson: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "candidateInputsJson",
    label: "Candidate inputs json",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const drawn = corpus(base, input, context);
  const exercises = drawn.result.exercises.map((e) => ({
    ...e,
    acronymPrompt: e.answer,
    callerReferenceText: e.input.text,
  }));
  return { result: { ...drawn.result, exercises } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateInputsJson: ['{"text": "portable network graphics"}'],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/acronym-expansion-puzzle",
  title: "Random Acronym Expansion Puzzle Generator",
  description:
    "Build a bounded reproducible acronym expansion puzzle from explicitly supplied candidate scenarios. Every candidate must satisfy imported text/acronym before selection; answer cards preserve its units, conventions, domain limitations and signed/unknown results. Draws are uniform over caller candidate positions; no replacement means no repeated positions, not necessarily distinct answers. No automatic pedagogical correctness, compliance or physical readiness. Original caller phrase/text is the reference answer; a stripped prompt/acronym can admit many valid expansions or punctuations, so no unique linguistic answer is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
