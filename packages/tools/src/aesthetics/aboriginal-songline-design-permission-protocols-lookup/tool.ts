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
          "Songline-related design knowledge and permissions are Aboriginal community, country and custodianship specific.",
        reference:
          "Indigenous Cultural and Intellectual Property protocols; community authorities.",
        limitations:
          "No generic permission to copy designs or disclose restricted knowledge.",
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
      text: "Songline-related design knowledge and permissions are Aboriginal community, country and custodianship specific.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/aboriginal-songline-design-permission-protocols-lookup",
  title: "Aboriginal Songline Design Permission Protocols Lookup",
  description:
    "Bounded offline reference: Songline-related design knowledge and permissions are Aboriginal community, country and custodianship specific. Source: Indigenous Cultural and Intellectual Property protocols; community authorities. No generic permission to copy designs or disclose restricted knowledge. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
