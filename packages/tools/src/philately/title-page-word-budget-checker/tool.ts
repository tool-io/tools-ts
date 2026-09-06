import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly titleText: string;
  readonly callerWordBudget: number;
}>;
export type Output = Readonly<{
  readonly observedWhitespaceWords: number;
  readonly signedBudgetMargin: number;
  readonly withinCallerBudget: boolean;
}>;
const inputFields = [
  { id: "titleText", label: "Title text", kind: "string" },
  { id: "callerWordBudget", label: "Caller word budget", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerWordBudget, "budget", 0, 100000);
  const n = input.titleText.trim()
    ? input.titleText.trim().split(/\s+/u).length
    : 0;
  return {
    observedWhitespaceWords: n,
    signedBudgetMargin: input.callerWordBudget - n,
    withinCallerBudget: n <= input.callerWordBudget,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  titleText: "The history of this issue",
  callerWordBudget: 5,
} satisfies Input;
export const exampleOutput = {
  observedWhitespaceWords: 5,
  signedBudgetMargin: 0,
  withinCallerBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/title-page-word-budget-checker",
  title: "Exhibit Title Page Word Budget Compliance Checker",
  description:
    "Count whitespace-delimited title-page words under an explicit caller exhibit budget, not universal FIP compliance. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWhitespaceWords",
      label: "Observed whitespace words",
      kind: "number",
    },
    { id: "signedBudgetMargin", label: "Signed budget margin", kind: "number" },
    {
      id: "withinCallerBudget",
      label: "Within caller budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      titleText: value.titleText as string,
      callerWordBudget: value.callerWordBudget as number,
    }),
});
export const run = tool.execute;
export default tool;
