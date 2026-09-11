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
          "Stanislavskis practice developed across periods, including emotional-memory and physical-action approaches.",
        reference: "Stanislavski actor-training writings and scholarship.",
        limitations:
          "Not an exhaustive linear replacement story or clinical/emotional exposure technique.",
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
      text: "Stanislavskis practice developed across periods, including emotional-memory and physical-action approaches.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/stanislavski-physical-actions-versus-emotion-memory-evolution",
  title: "Stanislavski Physical Actions Versus Emotion Memory Evolution",
  description:
    "Bounded offline reference: Stanislavskis practice developed across periods, including emotional-memory and physical-action approaches. Source: Stanislavski actor-training writings and scholarship. Not an exhaustive linear replacement story or clinical/emotional exposure technique. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
