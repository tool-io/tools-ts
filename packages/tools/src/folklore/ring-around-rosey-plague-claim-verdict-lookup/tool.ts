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
          "The plague interpretation of Ring-a-ring-o-roses is a later explanation without secure evidence of that original meaning.",
        reference: "Opie and Opie, The Oxford Dictionary of Nursery Rhymes.",
        limitations:
          "Rhyme variants and publication dates matter; no inference that every historic performer meant plague.",
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
      text: "The plague interpretation of Ring-a-ring-o-roses is a later explanation without secure evidence of that original meaning.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/ring-around-rosey-plague-claim-verdict-lookup",
  title: "Ring Around Rosey Plague Claim Verdict Lookup",
  description:
    "Bounded offline reference: The plague interpretation of Ring-a-ring-o-roses is a later explanation without secure evidence of that original meaning. Source: Opie and Opie, The Oxford Dictionary of Nursery Rhymes. Rhyme variants and publication dates matter; no inference that every historic performer meant plague. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
