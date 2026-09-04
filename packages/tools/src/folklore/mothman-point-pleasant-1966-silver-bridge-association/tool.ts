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
          "Mothman reports in Point Pleasant are associated with 1966\u201367and later Silver Bridge-collapse narratives.",
        reference:
          "Point Pleasant local history; Mothman folklore scholarship.",
        limitations:
          "Later association does not establish a causal omen or explain the bridge failure.",
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
      text: "Mothman reports in Point Pleasant are associated with 1966\u201367and later Silver Bridge-collapse narratives.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/mothman-point-pleasant-1966-silver-bridge-association",
  title: "Mothman Point Pleasant 1966 Silver Bridge Association",
  description:
    "Bounded offline reference: Mothman reports in Point Pleasant are associated with 1966\u201367and later Silver Bridge-collapse narratives. Source: Point Pleasant local history; Mothman folklore scholarship. Later association does not establish a causal omen or explain the bridge failure. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
