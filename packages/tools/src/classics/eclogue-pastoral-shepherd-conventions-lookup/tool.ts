import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

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
          "Pastoral eclogue conventions include stylized herdsmen, song contests, rural settings and interplay with political or literary concerns.",
        reference: "Theocritus, Idylls; Virgil, Eclogues.",
        limitations:
          "Not every rural poem is pastoral; conventional description is not an automatic genre detector.",
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
      text: "Pastoral eclogue conventions include stylized herdsmen, song contests, rural settings and interplay with political or literary concerns.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/eclogue-pastoral-shepherd-conventions-lookup",
  title: "Eclogue Pastoral Shepherd Conventions Lookup",
  description:
    "Offline bounded reference card: Pastoral eclogue conventions include stylized herdsmen, song contests, rural settings and interplay with political or literary concerns. References Theocritus, Idylls; Virgil, Eclogues. Not every rural poem is pastoral; conventional description is not an automatic genre detector.",
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
