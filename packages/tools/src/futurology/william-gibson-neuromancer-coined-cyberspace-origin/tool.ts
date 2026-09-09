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
          "Gibsons term cyberspace appeared in Burning Chrome1982before Neuromancer1984popularized it.",
        reference: "Gibson, Burning Chrome 1982; Neuromancer 1984.",
        limitations:
          "Corrected origin; literary language does not prove legal prior art or invention of the internet.",
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
      text: "Gibsons term cyberspace appeared in Burning Chrome1982before Neuromancer1984popularized it.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/william-gibson-neuromancer-coined-cyberspace-origin",
  title: "William Gibson Neuromancer Coined Cyberspace Origin",
  description:
    "Bounded offline reference: Gibsons term cyberspace appeared in Burning Chrome1982before Neuromancer1984popularized it. Source: Gibson, Burning Chrome 1982; Neuromancer 1984. Corrected origin; literary language does not prove legal prior art or invention of the internet. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
