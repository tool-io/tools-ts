import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Boals forum theatre invites spect-actor intervention; legislative theatre connects performance with deliberation about law.",
        reference: "Boal, Theatre of the Oppressed; Legislative Theatre.",
        limitations:
          "Participation does not guarantee empowerment, consent, safe intervention or actual legislative change.",
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
      text: "Boals forum theatre invites spect-actor intervention; legislative theatre connects performance with deliberation about law.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/boal-oppressed-spect-actor-legislative-forum-methods",
  title: "Boal Oppressed Spect Actor Legislative Forum Methods",
  description:
    "Bounded offline reference: Boals forum theatre invites spect-actor intervention; legislative theatre connects performance with deliberation about law. Source: Boal, Theatre of the Oppressed; Legislative Theatre. Participation does not guarantee empowerment, consent, safe intervention or actual legislative change. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
