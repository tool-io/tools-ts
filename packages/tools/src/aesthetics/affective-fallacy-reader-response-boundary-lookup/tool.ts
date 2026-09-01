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
          "The affective fallacy essay criticizes treating a poem's effects on readers as the sole standard of its meaning/value.",
        reference: "Wimsatt and Beardsley, The Affective Fallacy 1949.",
        limitations:
          "Not a claim that audience experience cannot be studied or that reader-response theories are identical.",
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
      text: "The affective fallacy essay criticizes treating a poem's effects on readers as the sole standard of its meaning/value.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/affective-fallacy-reader-response-boundary-lookup",
  title: "Affective Fallacy Reader Response Boundary Lookup",
  description:
    "Bounded offline reference: The affective fallacy essay criticizes treating a poem's effects on readers as the sole standard of its meaning/value. Source: Wimsatt and Beardsley, The Affective Fallacy 1949. Not a claim that audience experience cannot be studied or that reader-response theories are identical. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
