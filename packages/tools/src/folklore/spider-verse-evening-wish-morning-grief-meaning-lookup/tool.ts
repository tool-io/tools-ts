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
          "Morning/evening spider verses vary and can assign contrasting emotional or luck meanings.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Verse is not a valid venom-risk assessment or magical prediction.",
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
      text: "Morning/evening spider verses vary and can assign contrasting emotional or luck meanings.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/spider-verse-evening-wish-morning-grief-meaning-lookup",
  title: "Spider Verse Evening Wish Morning Grief Meaning Lookup",
  description:
    "Bounded offline reference: Morning/evening spider verses vary and can assign contrasting emotional or luck meanings. Source: Simpson and Roud, A Dictionary of English Folklore. Verse is not a valid venom-risk assessment or magical prediction. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
