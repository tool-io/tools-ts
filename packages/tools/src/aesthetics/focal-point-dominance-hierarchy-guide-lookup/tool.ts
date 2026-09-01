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
          "Focal hierarchy can be discussed through relative contrast, scale, position and directional cues.",
        reference: "Visual composition and perception scholarship.",
        limitations:
          "Salience depends on viewers, task and context; no universal focal point from one isolated feature.",
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
      text: "Focal hierarchy can be discussed through relative contrast, scale, position and directional cues.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/focal-point-dominance-hierarchy-guide-lookup",
  title: "Focal Point Dominance Hierarchy Guide Lookup",
  description:
    "Bounded offline reference: Focal hierarchy can be discussed through relative contrast, scale, position and directional cues. Source: Visual composition and perception scholarship. Salience depends on viewers, task and context; no universal focal point from one isolated feature. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
