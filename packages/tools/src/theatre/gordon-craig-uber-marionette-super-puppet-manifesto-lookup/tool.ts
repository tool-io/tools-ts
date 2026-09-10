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
          "Craigs \u00dcber-marionette essay critiques conventional acting and proposes a contested performance ideal.",
        reference: "Gordon Craig, The Actor and the \u00dcber-marionette 1908.",
        limitations:
          "Not a literal universal replacement of performers by puppets or a one-method production rule.",
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
      text: "Craigs \u00dcber-marionette essay critiques conventional acting and proposes a contested performance ideal.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/gordon-craig-uber-marionette-super-puppet-manifesto-lookup",
  title: "Gordon Craig\u00dcber-Marionette Super Puppet Manifesto Lookup",
  description:
    "Bounded offline reference: Craigs \u00dcber-marionette essay critiques conventional acting and proposes a contested performance ideal. Source: Gordon Craig, The Actor and the \u00dcber-marionette 1908. Not a literal universal replacement of performers by puppets or a one-method production rule. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
