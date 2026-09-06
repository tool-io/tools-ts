import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly minutePaperFocus: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "minutePaperFocus", label: "Minute paper focus", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.minutePaperFocus,
      {
        muddiest: "What was the least clear point in this lesson?",
        important: "What was the most important idea you learned?",
        question: "What question remains unanswered for you?",
      },
      "minutePaperFocus",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { minutePaperFocus: "muddiest" } satisfies Input;
export const exampleOutput = {
  meaning: "What was the least clear point in this lesson?",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/muddiest-point-one-minute-paper-prompts",
  title: "Muddiest Point One Minute Paper Prompts",
  description:
    "Supported minute-paper prompt stems, not quantitative scoring or validated one timing for learners. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ minutePaperFocus: value.minutePaperFocus as string }),
});
export const run = tool.execute;
export default tool;
