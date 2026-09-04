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
          "Basile, Perrault and Grimm transmit different Sleeping Beauty plots, including Basiles Sun, Moon and Talia.",
        reference: "Basile, Pentamerone 5.5; Perrault; Grimm, KHM 50.",
        limitations:
          "Do not treat assault/coercion narratives as consent or equate every version with a modern family film.",
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
      text: "Basile, Perrault and Grimm transmit different Sleeping Beauty plots, including Basiles Sun, Moon and Talia.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/sleeping-beauty-sun-moon-talents-gifts-variant-lookup",
  title: "Sleeping Beauty Sun Moon Talents Gifts Variant Lookup",
  description:
    "Bounded offline reference: Basile, Perrault and Grimm transmit different Sleeping Beauty plots, including Basiles Sun, Moon and Talia. Source: Basile, Pentamerone 5.5; Perrault; Grimm, KHM 50. Do not treat assault/coercion narratives as consent or equate every version with a modern family film. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
