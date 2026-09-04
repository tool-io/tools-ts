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
          "Murder ballads narrate homicide, loss, judgment or transgression through different perspectives and traditions.",
        reference:
          "Child, English and Scottish Popular Ballads; American murder-ballad scholarship.",
        limitations:
          "Narrative content does not verify a real murder, justify violence or establish a single moral lesson.",
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
      text: "Murder ballads narrate homicide, loss, judgment or transgression through different perspectives and traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/murder-ballads-dark-plot-common-themes-lookup",
  title: "Murder Ballads Dark Plot Common Themes Lookup",
  description:
    "Bounded offline reference: Murder ballads narrate homicide, loss, judgment or transgression through different perspectives and traditions. Source: Child, English and Scottish Popular Ballads; American murder-ballad scholarship. Narrative content does not verify a real murder, justify violence or establish a single moral lesson. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
