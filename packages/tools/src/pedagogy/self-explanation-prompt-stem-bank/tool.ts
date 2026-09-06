import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerConcept: string;
  readonly promptFocus: string;
}>;
export type Output = Readonly<{ readonly selfExplanationPrompt: string }>;
const inputFields = [
  { id: "callerConcept", label: "Caller concept", kind: "string" },
  { id: "promptFocus", label: "Prompt focus", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.callerConcept.trim() || input.callerConcept.length > 256)
    simpleError(
      "concept",
      "Nonempty boundedliteralconcept, notverifiedcontent.",
    );
  const stem = pick(
    input.promptFocus,
    {
      mechanism: ["How and why does ", " work in this example?"],
      connection: ["How does ", " connect to what you already know?"],
      contrast: ["What distinguishes ", " from a similar case?"],
    },
    "focus",
  );
  return { selfExplanationPrompt: stem[0] + input.callerConcept + stem[1] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerConcept: "fraction equivalence",
  promptFocus: "mechanism",
} satisfies Input;
export const exampleOutput = {
  selfExplanationPrompt:
    "How and why does fraction equivalence work in this example?",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/self-explanation-prompt-stem-bank",
  title: "Self Explanation Prompt Stem Bank",
  description:
    "Build bounded self explanation question from explicit concept and focus; no main claim answer or causal learning effect. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "selfExplanationPrompt",
      label: "Self explanation prompt",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerConcept: value.callerConcept as string,
      promptFocus: value.promptFocus as string,
    }),
});
export const run = tool.execute;
export default tool;
