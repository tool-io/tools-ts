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
          "Puppet eyeline depends on head orientation, camera/audience viewpoint and the intended focus; slightly downward focus is a performance convention in some contexts.",
        reference: "Puppet performance/camera practice.",
        limitations:
          "No universal angle or guaranteed perceived attention; actual design and scene matter.",
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
      text: "Puppet eyeline depends on head orientation, camera/audience viewpoint and the intended focus; slightly downward focus is a performance convention in some contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/muppet-eyeline-focus-downward-gaze-rule-performance",
  title: "Muppet Eyeline Focus Downward Gaze Rule Performance",
  description:
    "Bounded offline reference: Puppet eyeline depends on head orientation, camera/audience viewpoint and the intended focus; slightly downward focus is a performance convention in some contexts. Source: Puppet performance/camera practice. No universal angle or guaranteed perceived attention; actual design and scene matter. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
