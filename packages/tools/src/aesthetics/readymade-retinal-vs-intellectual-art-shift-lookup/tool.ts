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
          "Duchamps readymades challenge assumptions that art depends on retinal pleasure or traditional handcraft alone.",
        reference:
          "Duchamp writings/interviews; readymade art-historical scholarship.",
        limitations:
          "Not every found object is automatically art or an exemption from provenance/permission.",
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
      text: "Duchamps readymades challenge assumptions that art depends on retinal pleasure or traditional handcraft alone.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/readymade-retinal-vs-intellectual-art-shift-lookup",
  title: "Readymade Retinal vs Intellectual Art Shift Lookup",
  description:
    "Bounded offline reference: Duchamps readymades challenge assumptions that art depends on retinal pleasure or traditional handcraft alone. Source: Duchamp writings/interviews; readymade art-historical scholarship. Not every found object is automatically art or an exemption from provenance/permission. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
