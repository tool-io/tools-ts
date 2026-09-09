import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch48-shared.js";
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
          "Adult attachment may be modeled dimensionally by anxiety and avoidance; popular category labels are not clinical diagnoses.",
        reference: "Adult attachment theory literature.",
        limitations:
          "Offline bounded framework note, no partner diagnosis, exclusive category, validated instrument or evidence that matching labels guarantees satisfaction.",
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
      text: "Adult attachment may be modeled dimensionally by anxiety and avoidance; popular category labels are not clinical diagnoses.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/attachment-style-lookup",
  title: "Attachment Style Lookup",
  description:
    "Bounded offline reference: Adult attachment may be modeled dimensionally by anxiety and avoidance; popular category labels are not clinical diagnoses. Source: Adult attachment theory literature. Offline bounded framework note, no partner diagnosis, exclusive category, validated instrument or evidence that matching labels guarantees satisfaction. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
