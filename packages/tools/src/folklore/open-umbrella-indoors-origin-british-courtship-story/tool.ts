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
          "Opening-umbrella-indoors explanations include retrospective hazard and symbolic stories without a single securely proven courtship origin.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Do not turn a plausible story into an established British origin or safety guarantee.",
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
      text: "Opening-umbrella-indoors explanations include retrospective hazard and symbolic stories without a single securely proven courtship origin.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/open-umbrella-indoors-origin-british-courtship-story",
  title: "Open Umbrella Indoors Origin British Courtship Story",
  description:
    "Bounded offline reference: Opening-umbrella-indoors explanations include retrospective hazard and symbolic stories without a single securely proven courtship origin. Source: Simpson and Roud, A Dictionary of English Folklore. Do not turn a plausible story into an established British origin or safety guarantee. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
