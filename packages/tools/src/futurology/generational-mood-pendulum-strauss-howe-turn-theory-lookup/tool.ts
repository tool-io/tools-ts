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
          "Strauss and Howes generational turning theory proposes recurring social eras, with contested historical fit and predictive claims.",
        reference: "Straussand Howe, The Fourth Turning 1997.",
        limitations:
          "Not a validated periodic law or deterministic prediction about a generation.",
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
      text: "Strauss and Howes generational turning theory proposes recurring social eras, with contested historical fit and predictive claims.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/generational-mood-pendulum-strauss-howe-turn-theory-lookup",
  title: "Generational Mood Pendulum Strauss Howe Turn Theory Lookup",
  description:
    "Bounded offline reference: Strauss and Howes generational turning theory proposes recurring social eras, with contested historical fit and predictive claims. Source: Straussand Howe, The Fourth Turning 1997. Not a validated periodic law or deterministic prediction about a generation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
