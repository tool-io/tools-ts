import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "Anchor-based minimal clinically important differences relate measured change to an external interpretable anchor in a defined population/context.",
        reference: "MCIDmethodology literature.",
        limitations:
          "MCIDis not minimal detectable change, a universal cutoff or proof a persons change matters.",
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
      text: "Anchor-based minimal clinically important differences relate measured change to an external interpretable anchor in a defined population/context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/mcid-anchor-based-clinically-important-lookup",
  title: "Mcid Anchor Based Clinically Important Lookup",
  description:
    "Bounded offline reference: Anchor-based minimal clinically important differences relate measured change to an external interpretable anchor in a defined population/context. Source: MCIDmethodology literature. MCIDis not minimal detectable change, a universal cutoff or proof a persons change matters. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
