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
          "Pecos Bill is a frontier tall-tale figure associated with impossible feats, including cyclone riding, in modern literary/folklore circulation.",
        reference: "Dorson, American Folklore.",
        limitations:
          "Not a documented historical cowboy or safely reproducible feat.",
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
      text: "Pecos Bill is a frontier tall-tale figure associated with impossible feats, including cyclone riding, in modern literary/folklore circulation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/pecos-bill-cyclone-riding-frontier-exaggeration-lookup",
  title: "Pecos Bill Cyclone Riding Frontier Exaggeration Lookup",
  description:
    "Bounded offline reference: Pecos Bill is a frontier tall-tale figure associated with impossible feats, including cyclone riding, in modern literary/folklore circulation. Source: Dorson, American Folklore. Not a documented historical cowboy or safely reproducible feat. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
