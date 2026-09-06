import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Hobo nickels are carved/altered coins associated with individual artists and broader later traditions.",
        reference: "Original Hobo Nickel Society historical resources.",
        limitations:
          "Style alone does not attribute an artist or prove an early itinerant origin.",
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
      text: "Hobo nickels are carved/altered coins associated with individual artists and broader later traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/hobo-nickel-carved-artist-tradition-lookup",
  title: "Hobo Nickel Carved Artist Tradition Lookup",
  description:
    "Bounded offline reference: Hobo nickels are carved/altered coins associated with individual artists and broader later traditions. Source: Original Hobo Nickel Society historical resources. Style alone does not attribute an artist or prove an early itinerant origin. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
