import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mean, pick } from "../batch44-shared.js";

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
          "Hegels symbolic, classical and romantic art forms express a philosophical relation of idea and sensuous form; end of art does not mean no later artworks.",
        reference: "Hegel, Lectures on Aesthetics.",
        limitations:
          "Editorial transmission and interpretation matter; not a deterministic civilization timeline.",
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
      text: "Hegels symbolic, classical and romantic art forms express a philosophical relation of idea and sensuous form; end of art does not mean no later artworks.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/hegel-end-of-art-forms-sequence-lookup",
  title: "Hegel End of Art Forms Sequence Lookup",
  description:
    "Bounded offline reference: Hegels symbolic, classical and romantic art forms express a philosophical relation of idea and sensuous form; end of art does not mean no later artworks. Source: Hegel, Lectures on Aesthetics. Editorial transmission and interpretation matter; not a deterministic civilization timeline. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
