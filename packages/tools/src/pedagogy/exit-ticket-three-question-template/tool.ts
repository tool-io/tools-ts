import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{ readonly callerLessonConcept: string }>;
export type Output = Readonly<{
  readonly exitTicketQuestions: readonly string[];
}>;
const inputFields = [
  { id: "callerLessonConcept", label: "Caller lesson concept", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.callerLessonConcept.trim() ||
    input.callerLessonConcept.length > 256
  )
    simpleError("concept", "Bounded nonemptyliteralconcept.");
  return {
    exitTicketQuestions: [
      "What is one key idea about " + input.callerLessonConcept + "?",
      "Show an example of " + input.callerLessonConcept + " and explain it.",
      "What question do you still have about " +
        input.callerLessonConcept +
        "?",
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLessonConcept: "equivalent fractions",
} satisfies Input;
export const exampleOutput = {
  exitTicketQuestions: [
    "What is one key idea about equivalent fractions?",
    "Show an example of equivalent fractions and explain it.",
    "What question do you still have about equivalent fractions?",
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/exit-ticket-three-question-template",
  title: "Exit Ticket Three Question Template",
  description:
    "Build three explicit recall/example/uncertainty prompts from lesson concept, no fabricated correct answers or diagnostic certainty. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "exitTicketQuestions",
      label: "Exit ticket questions",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({ callerLessonConcept: value.callerLessonConcept as string }),
});
export const run = tool.execute;
export default tool;
