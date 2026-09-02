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
          "Le Corbusiers Modulor relates an idealized human figure and proportional red/blue scale series, using the golden ratio.",
        reference: "Le Corbusier, Le Modulor 1948; Modulor21955.",
        limitations:
          "Edition and units matter; no inclusive universal human-size or ergonomic guarantee.",
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
      text: "Le Corbusiers Modulor relates an idealized human figure and proportional red/blue scale series, using the golden ratio.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/le-corbusier-modulor-red-blue-scale-lookup",
  title: "Le Corbusier Modulor Red Blue Scale Lookup",
  description:
    "Bounded offline reference: Le Corbusiers Modulor relates an idealized human figure and proportional red/blue scale series, using the golden ratio. Source: Le Corbusier, Le Modulor 1948; Modulor21955. Edition and units matter; no inclusive universal human-size or ergonomic guarantee. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
