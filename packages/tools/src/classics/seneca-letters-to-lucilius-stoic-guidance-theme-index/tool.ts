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
        time: "Letter1 discusses time and its use.",
        friendship: "Letter3 discusses friendship and judgment.",
        death: "Letter24 discusses fear of death and anticipation.",
        reading:
          "Letter2 discusses reading and stability rather than restless sampling.",
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
  input: { topic: "time" },
  output: { result: { text: "Letter1 discusses time and its use." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/seneca-letters-to-lucilius-stoic-guidance-theme-index",
  title: "Seneca Letters to Lucilius Stoic Guidance Theme Index",
  description:
    "Bounded offline reference: A bounded thematic index of Senecas letters supports source-qualified starting points. Source: Seneca, Epistulae Morales. Not exhaustive indexing, medical treatment or a universal interpretation of every passage. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
