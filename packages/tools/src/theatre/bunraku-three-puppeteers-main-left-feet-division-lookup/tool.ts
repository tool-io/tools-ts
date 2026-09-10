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
          "Bunraku principal, left-hand and foot operators traditionally coordinate a puppet, with training and roles depending on context.",
        reference: "Japanese Bunraku theatre interpretation resources.",
        limitations:
          "The three-operator model is not universal to every puppet/scene or a substitute for cultural training.",
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
      text: "Bunraku principal, left-hand and foot operators traditionally coordinate a puppet, with training and roles depending on context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/bunraku-three-puppeteers-main-left-feet-division-lookup",
  title: "Bunraku Three Puppeteers Main Left Feet Division Lookup",
  description:
    "Bounded offline reference: Bunraku principal, left-hand and foot operators traditionally coordinate a puppet, with training and roles depending on context. Source: Japanese Bunraku theatre interpretation resources. The three-operator model is not universal to every puppet/scene or a substitute for cultural training. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
