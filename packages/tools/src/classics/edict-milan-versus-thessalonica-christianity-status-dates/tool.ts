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
          "Milan 313 CE is associated with imperial religious toleration/restoration policy; Thessalonica 380 CE with Nicene-Christian imperial prescription.",
        reference: "Lactantius 48; Codex Theodosianus 16.1.2.",
        limitations:
          "Different policies and contexts, not identical instant establishment of a uniform empire-wide practice.",
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
      text: "Milan 313 CE is associated with imperial religious toleration/restoration policy; Thessalonica 380 CE with Nicene-Christian imperial prescription.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/edict-milan-versus-thessalonica-christianity-status-dates",
  title: "Edict Milan Versus Thessalonica Christianity Status Dates",
  description:
    "Bounded offline reference: Milan 313 CE is associated with imperial religious toleration/restoration policy; Thessalonica 380 CE with Nicene-Christian imperial prescription. Source: Lactantius 48; Codex Theodosianus 16.1.2. Different policies and contexts, not identical instant establishment of a uniform empire-wide practice. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
