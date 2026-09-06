import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly primaryAssessmentUse: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  {
    id: "primaryAssessmentUse",
    label: "Primary assessment use",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.primaryAssessmentUse,
      {
        "instruction-adjustment":
          "formative use: evidence informs subsequent learning or instruction",
        "achievement-summary":
          "summative use: evidence summarizes achievement for reporting or certification",
        both: "the same evidence may serve formative and summative purposes",
      },
      "primaryAssessmentUse",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { primaryAssessmentUse: "both" } satisfies Input;
export const exampleOutput = {
  meaning: "the same evidence may serve formative and summative purposes",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/formative-vs-summative-purpose-classifier",
  title: "Formative vs Summative Purpose Classifier",
  description:
    "Classify explicit primary USE—not assessment format, stakesordatealone. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ primaryAssessmentUse: value.primaryAssessmentUse as string }),
});
export const run = tool.execute;
export default tool;
