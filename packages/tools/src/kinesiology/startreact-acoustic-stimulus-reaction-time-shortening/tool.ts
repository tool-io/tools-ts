import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "StartReactdescribes early release of a prepared response associated with a startling stimulus in specific research contexts.",
        reference: "StartReactmotor-control research.",
        limitations:
          "Not universally shorter reaction times or permission to use hazardous acoustic stimulation.",
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
      text: "StartReactdescribes early release of a prepared response associated with a startling stimulus in specific research contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/startreact-acoustic-stimulus-reaction-time-shortening",
  title: "Startreact Acoustic Stimulus Reaction Time Shortening",
  description:
    "Bounded offline reference: StartReactdescribes early release of a prepared response associated with a startling stimulus in specific research contexts. Source: StartReactmotor-control research. Not universally shorter reaction times or permission to use hazardous acoustic stimulation. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
