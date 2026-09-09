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
          "Preferred-future visioning can invite participants to imagine a dated future, describe lived conditions, identify values and contrast pathways/assumptions.",
        reference: "Participatory futures/visioning workshop literature.",
        limitations:
          "Voluntary accessible facilitation; a preferred future is normative, not a forecast or consent to implementation.",
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
      text: "Preferred-future visioning can invite participants to imagine a dated future, describe lived conditions, identify values and contrast pathways/assumptions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/visioning-workshop-guided-preferred-future-script-method",
  title: "Visioning Workshop Guided Preferred Future Script Method",
  description:
    "Bounded offline reference: Preferred-future visioning can invite participants to imagine a dated future, describe lived conditions, identify values and contrast pathways/assumptions. Source: Participatory futures/visioning workshop literature. Voluntary accessible facilitation; a preferred future is normative, not a forecast or consent to implementation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
