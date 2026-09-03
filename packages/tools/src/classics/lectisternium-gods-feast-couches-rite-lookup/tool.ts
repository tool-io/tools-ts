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
          "Lectisternium describes a ritual banquet presentation for deities using couches/images in specified Roman contexts.",
        reference: "Livy 5.13; Roman ritual scholarship.",
        limitations:
          "Forms and invited deities vary; historical description only, no effective ritual or safe reconstruction instruction.",
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
      text: "Lectisternium describes a ritual banquet presentation for deities using couches/images in specified Roman contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/lectisternium-gods-feast-couches-rite-lookup",
  title: "Lectisternium Gods Feast Couches Rite Lookup",
  description:
    "Bounded offline reference: Lectisternium describes a ritual banquet presentation for deities using couches/images in specified Roman contexts. Source: Livy 5.13; Roman ritual scholarship. Forms and invited deities vary; historical description only, no effective ritual or safe reconstruction instruction. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
