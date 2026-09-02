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
          "Shibui/shibumi describes understated, restrained complexity in particular discussions; fixed seven-factor lists are modern formulations.",
        reference: "Japanese aesthetic scholarship.",
        limitations:
          "No universal canonical seven-part doctrine or personality assessment.",
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
      text: "Shibui/shibumi describes understated, restrained complexity in particular discussions; fixed seven-factor lists are modern formulations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/shibui-seven-factors-shibumi-lookup",
  title: "Shibui Seven Factors Shibumi Lookup",
  description:
    "Bounded offline reference: Shibui/shibumi describes understated, restrained complexity in particular discussions; fixed seven-factor lists are modern formulations. Source: Japanese aesthetic scholarship. No universal canonical seven-part doctrine or personality assessment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
