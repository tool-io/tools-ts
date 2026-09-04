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
          "Bluebeard joins forbidden-room discovery, an incriminating key and threatened violence in familiar literary versions.",
        reference: "Perrault, La Barbe bleue.",
        limitations:
          "Interpretation varies; the story does not justify coercive control or victim blame.",
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
      text: "Bluebeard joins forbidden-room discovery, an incriminating key and threatened violence in familiar literary versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/bluebeard-forbidden-chamber-key-blood-taboo-analysis",
  title: "Bluebeard Forbidden Chamber Key Blood Taboo Analysis",
  description:
    "Bounded offline reference: Bluebeard joins forbidden-room discovery, an incriminating key and threatened violence in familiar literary versions. Source: Perrault, La Barbe bleue. Interpretation varies; the story does not justify coercive control or victim blame. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
