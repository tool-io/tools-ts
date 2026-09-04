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
          "William Tell is central to Swiss liberation legend; apple-shot narrative historicity and source chronology remain contested.",
        reference:
          "Swiss Tell tradition; White Book of Sarnen; Schiller, Wilhelm Tell.",
        limitations:
          "Later literary prominence is not independent contemporary proof of the feat.",
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
      text: "William Tell is central to Swiss liberation legend; apple-shot narrative historicity and source chronology remain contested.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/william-tell-apple-shot-authenticity-debate-lookup",
  title: "William Tell Apple Shot Authenticity Debate Lookup",
  description:
    "Bounded offline reference: William Tell is central to Swiss liberation legend; apple-shot narrative historicity and source chronology remain contested. Source: Swiss Tell tradition; White Book of Sarnen; Schiller, Wilhelm Tell. Later literary prominence is not independent contemporary proof of the feat. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
