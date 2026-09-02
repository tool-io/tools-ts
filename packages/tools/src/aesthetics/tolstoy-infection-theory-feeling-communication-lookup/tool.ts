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
          "Tolstoys account treats art as communication or infection of feeling from maker to recipients.",
        reference: "Tolstoy, What Is Art?1897.",
        limitations:
          "Historical evaluative theory, not a measured emotional-contagion guarantee.",
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
      text: "Tolstoys account treats art as communication or infection of feeling from maker to recipients.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/tolstoy-infection-theory-feeling-communication-lookup",
  title: "Tolstoy Infection Theory Feeling Communication Lookup",
  description:
    "Bounded offline reference: Tolstoys account treats art as communication or infection of feeling from maker to recipients. Source: Tolstoy, What Is Art?1897. Historical evaluative theory, not a measured emotional-contagion guarantee. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
