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
          "Barthes critiques the Author as a single controlling source of textual meaning and foregrounds writing/reading relations.",
        reference: "Barthes, The Death of the Author 1967.",
        limitations:
          "Not literal author death, copyright extinction or permission to ignore attribution.",
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
      text: "Barthes critiques the Author as a single controlling source of textual meaning and foregrounds writing/reading relations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/death-of-the-author-barthes-scriptor-lookup",
  title: "Death of the Author Barthes Scriptor Lookup",
  description:
    "Bounded offline reference: Barthes critiques the Author as a single controlling source of textual meaning and foregrounds writing/reading relations. Source: Barthes, The Death of the Author 1967. Not literal author death, copyright extinction or permission to ignore attribution. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
