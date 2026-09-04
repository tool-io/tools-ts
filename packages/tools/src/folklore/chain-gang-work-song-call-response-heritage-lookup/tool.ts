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
          "Chain-gang work songs can coordinate labor and express experience under coercive penal conditions.",
        reference:
          "Library of Congress, field recordings and contextual documentation.",
        limitations:
          "Avoid romanticizing forced labor; recording ownership, consent and performer context matter.",
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
      text: "Chain-gang work songs can coordinate labor and express experience under coercive penal conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/chain-gang-work-song-call-response-heritage-lookup",
  title: "Chain Gang Work Song Call Response Heritage Lookup",
  description:
    "Bounded offline reference: Chain-gang work songs can coordinate labor and express experience under coercive penal conditions. Source: Library of Congress, field recordings and contextual documentation. Avoid romanticizing forced labor; recording ownership, consent and performer context matter. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
