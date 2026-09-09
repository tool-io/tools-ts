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
          "Hopepunk foregrounds hope, care and resistance as active choices rather than an assurance everything improves.",
        reference: "AlexandraRowland, hopepunk genre discussions 2017.",
        limitations:
          "Genre label not a measurable forecast, political programme or injunction to dismiss genuine risk.",
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
      text: "Hopepunk foregrounds hope, care and resistance as active choices rather than an assurance everything improves.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/hopepunk-genre-counter-doomer-optimism-lookup",
  title: "Hopepunk Genre Counter Doomer Optimism Lookup",
  description:
    "Bounded offline reference: Hopepunk foregrounds hope, care and resistance as active choices rather than an assurance everything improves. Source: AlexandraRowland, hopepunk genre discussions 2017. Genre label not a measurable forecast, political programme or injunction to dismiss genuine risk. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
