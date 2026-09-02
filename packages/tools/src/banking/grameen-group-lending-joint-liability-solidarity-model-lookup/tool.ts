import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Grameen group-lending history includes solidarity/group mechanisms, but formal joint-liability arrangements vary across phases and programs.",
        reference: "Grameen institutional histories; microfinance scholarship.",
        limitations:
          "No universal legal mutual guarantee or guaranteed poverty/credit outcome.",
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
      text: "Grameen group-lending history includes solidarity/group mechanisms, but formal joint-liability arrangements vary across phases and programs.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/grameen-group-lending-joint-liability-solidarity-model-lookup",
  title: "Grameen Group Lending Joint Liability Solidarity Model Lookup",
  description:
    "Bounded offline reference: Grameen group-lending history includes solidarity/group mechanisms, but formal joint-liability arrangements vary across phases and programs. Source: Grameen institutional histories; microfinance scholarship. No universal legal mutual guarantee or guaranteed poverty/credit outcome. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
