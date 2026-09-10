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
          "Standby prepares an identified cue; go is the execution instruction under the actual caller protocol.",
        reference: "Stage-management headset practice.",
        limitations:
          "Avoid ambiguous chatter and verify local conventions; this reference does not execute cues or establish operator readiness.",
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
      text: "Standby prepares an identified cue; go is the execution instruction under the actual caller protocol.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/headset-etiquette-caller-standby-expect-go-discipline",
  title: "Headset Etiquette Caller Standby Expect Go Discipline",
  description:
    "Bounded offline reference: Standby prepares an identified cue; go is the execution instruction under the actual caller protocol. Source: Stage-management headset practice. Avoid ambiguous chatter and verify local conventions; this reference does not execute cues or establish operator readiness. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
