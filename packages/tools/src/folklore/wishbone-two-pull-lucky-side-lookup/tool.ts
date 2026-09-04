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
          "Wishbone customs commonly associate the larger broken piece with a wish in particular versions.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Narrative custom only, not an efficacy claim or safe physical-play instruction.",
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
      text: "Wishbone customs commonly associate the larger broken piece with a wish in particular versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/wishbone-two-pull-lucky-side-lookup",
  title: "Wishbone Two Pull Lucky Side Lookup",
  description:
    "Bounded offline reference: Wishbone customs commonly associate the larger broken piece with a wish in particular versions. Source: Simpson and Roud, A Dictionary of English Folklore. Narrative custom only, not an efficacy claim or safe physical-play instruction. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
