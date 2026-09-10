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
          "Promenade/immersive work can allow audience movement through distributed performance spaces; Punchdrunk is one influential company.",
        reference: "Punchdrunk production histories.",
        limitations:
          "Actual access, crowd routes, consent and safety require site-specific review, not an automatic open-flow template.",
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
      text: "Promenade/immersive work can allow audience movement through distributed performance spaces; Punchdrunk is one influential company.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/punchdrunk-promenade-audience-flow-design-sleep-no-more",
  title: "Punchdrunk Promenade Audience Flow Design Sleep No More",
  description:
    "Bounded offline reference: Promenade/immersive work can allow audience movement through distributed performance spaces; Punchdrunk is one influential company. Source: Punchdrunk production histories. Actual access, crowd routes, consent and safety require site-specific review, not an automatic open-flow template. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
