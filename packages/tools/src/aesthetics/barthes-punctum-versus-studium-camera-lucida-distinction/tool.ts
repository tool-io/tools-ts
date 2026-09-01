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
          "Barthes studium concerns culturally informed interest; punctum names a personally piercing detail or effect in his photographic reflections.",
        reference: "Barthes, Camera Lucida 1980.",
        limitations:
          "Punctum is not a universally marked visual object or guaranteed viewer response.",
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
      text: "Barthes studium concerns culturally informed interest; punctum names a personally piercing detail or effect in his photographic reflections.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/barthes-punctum-versus-studium-camera-lucida-distinction",
  title: "Barthes Punctum Versus Studium Camera Lucida Distinction",
  description:
    "Bounded offline reference: Barthes studium concerns culturally informed interest; punctum names a personally piercing detail or effect in his photographic reflections. Source: Barthes, Camera Lucida 1980. Punctum is not a universally marked visual object or guaranteed viewer response. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
