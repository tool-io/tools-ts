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
          "Brutalism can provoke divergent responses related to material, mass, setting, history and social associations.",
        reference: "Architecture history and reception scholarship.",
        limitations:
          "No universal love/hate split or quantitative viewer response inferred from concrete alone.",
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
      text: "Brutalism can provoke divergent responses related to material, mass, setting, history and social associations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/brutalist-beauty-love-hate-divide-lookup",
  title: "Brutalist Beauty Love Hate Divide Lookup",
  description:
    "Bounded offline reference: Brutalism can provoke divergent responses related to material, mass, setting, history and social associations. Source: Architecture history and reception scholarship. No universal love/hate split or quantitative viewer response inferred from concrete alone. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
