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
          "Gliaria are associated with keeping/fattening dormice in particular Roman elite culinary contexts.",
        reference:
          "Varro, De re rustica 3.15; archaeological ceramic evidence.",
        limitations:
          "Not universal daily Roman diet or animal-husbandry/food-safety instructions.",
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
      text: "Gliaria are associated with keeping/fattening dormice in particular Roman elite culinary contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/dormice-gliaria-jars-edible-dormouse-delicacy-lookup",
  title: "Dormice Gliaria Jars Edible Dormouse Delicacy Lookup",
  description:
    "Bounded offline reference: Gliaria are associated with keeping/fattening dormice in particular Roman elite culinary contexts. Source: Varro, De re rustica 3.15; archaeological ceramic evidence. Not universal daily Roman diet or animal-husbandry/food-safety instructions. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
