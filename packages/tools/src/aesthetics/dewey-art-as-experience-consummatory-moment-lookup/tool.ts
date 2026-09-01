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
          "Dewey treats art through organism-environment experience and integrated, consummatory development.",
        reference: "Dewey, Art as Experience 1934.",
        limitations:
          "Not a fixed peak-emotion scale or a universal single moment.",
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
      text: "Dewey treats art through organism-environment experience and integrated, consummatory development.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/dewey-art-as-experience-consummatory-moment-lookup",
  title: "Dewey Art As Experience Consummatory Moment Lookup",
  description:
    "Bounded offline reference: Dewey treats art through organism-environment experience and integrated, consummatory development. Source: Dewey, Art as Experience 1934. Not a fixed peak-emotion scale or a universal single moment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
