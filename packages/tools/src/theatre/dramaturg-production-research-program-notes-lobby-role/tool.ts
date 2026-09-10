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
          "Production dramaturgy can include contextual research, text analysis, program material and dialogue with artistic teams.",
        reference: "Dramaturgical practice literature.",
        limitations:
          "Roles vary; research notes do not grant copyright or establish all historical claims.",
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
      text: "Production dramaturgy can include contextual research, text analysis, program material and dialogue with artistic teams.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dramaturg-production-research-program-notes-lobby-role",
  title: "Dramaturg Production Research Program Notes Lobby Role",
  description:
    "Bounded offline reference: Production dramaturgy can include contextual research, text analysis, program material and dialogue with artistic teams. Source: Dramaturgical practice literature. Roles vary; research notes do not grant copyright or establish all historical claims. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
