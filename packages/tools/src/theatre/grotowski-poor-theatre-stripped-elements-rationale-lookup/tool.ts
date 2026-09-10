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
          "Grotowskis poor theatre emphasized actor/spectator relations and reduced dependence on elaborate theatrical machinery.",
        reference: "Grotowski, Towards a Poor Theatre 1968.",
        limitations:
          "Not merely low budget or permission to ignore training, safety or performer consent.",
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
      text: "Grotowskis poor theatre emphasized actor/spectator relations and reduced dependence on elaborate theatrical machinery.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/grotowski-poor-theatre-stripped-elements-rationale-lookup",
  title: "Grotowski Poor Theatre Stripped Elements Rationale Lookup",
  description:
    "Bounded offline reference: Grotowskis poor theatre emphasized actor/spectator relations and reduced dependence on elaborate theatrical machinery. Source: Grotowski, Towards a Poor Theatre 1968. Not merely low budget or permission to ignore training, safety or performer consent. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
