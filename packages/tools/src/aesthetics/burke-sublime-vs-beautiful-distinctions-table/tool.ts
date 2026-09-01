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
          "Burke distinguishes sublime associations of vastness, obscurity, power and terror from beautiful associations such as smallness, smoothness and delicacy.",
        reference:
          "Burke, Enquiry into the Origin of Our Ideas of the Sublime and Beautiful 1757.",
        limitations:
          "A historical argument, not universal preference or a danger-exposure prescription.",
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
      text: "Burke distinguishes sublime associations of vastness, obscurity, power and terror from beautiful associations such as smallness, smoothness and delicacy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/burke-sublime-vs-beautiful-distinctions-table",
  title: "Burke Sublime vs Beautiful Distinctions Table",
  description:
    "Bounded offline reference: Burke distinguishes sublime associations of vastness, obscurity, power and terror from beautiful associations such as smallness, smoothness and delicacy. Source: Burke, Enquiry into the Origin of Our Ideas of the Sublime and Beautiful 1757. A historical argument, not universal preference or a danger-exposure prescription. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
