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
          "Cornish and emigrant mining traditions describe knockers/tommyknockers as underground figures or warning sounds.",
        reference: "Cornish mining folklore; Dorson, American Folklore.",
        limitations:
          "Belief is not a ground-control warning system or safe mining guidance.",
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
      text: "Cornish and emigrant mining traditions describe knockers/tommyknockers as underground figures or warning sounds.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/miners-tommyknockers-warning-knocks-underground-belief",
  title: "Miners Tommyknockers Warning Knocks Underground Belief",
  description:
    "Bounded offline reference: Cornish and emigrant mining traditions describe knockers/tommyknockers as underground figures or warning sounds. Source: Cornish mining folklore; Dorson, American Folklore. Belief is not a ground-control warning system or safe mining guidance. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
