import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Lesbia is often identified with Clodia Metelli, but the identification and autobiographical reading remain scholarly arguments.",
        reference: "Catullus poems; Apuleius, Apologia 10.",
        limitations:
          "A literary pseudonym and later testimony do not prove every poem is direct biography.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Lesbia is often identified with Clodia Metelli, but the identification and autobiographical reading remain scholarly arguments.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/catullus-lesbia-clodia-identification-scholarly-debate-lookup",
  title: "Catullus Lesbia Clodia Identification Scholarly Debate Lookup",
  description:
    "Bounded offline reference: Lesbia is often identified with Clodia Metelli, but the identification and autobiographical reading remain scholarly arguments. Source: Catullus poems; Apuleius, Apologia 10. A literary pseudonym and later testimony do not prove every poem is direct biography. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
