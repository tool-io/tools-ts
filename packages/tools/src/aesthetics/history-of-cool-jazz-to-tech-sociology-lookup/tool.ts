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
          "Cool has changing aesthetic/social histories across African American culture, jazz, consumer design and technology discourse.",
        reference: "Cultural histories of cool.",
        limitations:
          "No single universal progression or erasure of cultural origin/context.",
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
      text: "Cool has changing aesthetic/social histories across African American culture, jazz, consumer design and technology discourse.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/history-of-cool-jazz-to-tech-sociology-lookup",
  title: "History of Cool Jazz to Tech Sociology Lookup",
  description:
    "Bounded offline reference: Cool has changing aesthetic/social histories across African American culture, jazz, consumer design and technology discourse. Source: Cultural histories of cool. No single universal progression or erasure of cultural origin/context. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
