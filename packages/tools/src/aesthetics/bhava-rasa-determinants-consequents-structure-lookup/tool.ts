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
          "Rasa accounts relate determinants, vibh\u0101va, consequents, anubh\u0101va, and transitory states, vyabhic\u0101ribh\u0101va, to aesthetic realization.",
        reference: "N\u0101\u1e6dya\u015b\u0101stra6\u20137; Abhinavagupta.",
        limitations:
          "The relation is a theoretical account, not a physiological formula or actor diagnosis.",
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
      text: "Rasa accounts relate determinants, vibh\u0101va, consequents, anubh\u0101va, and transitory states, vyabhic\u0101ribh\u0101va, to aesthetic realization.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/bhava-rasa-determinants-consequents-structure-lookup",
  title: "Bhava Rasa Determinants Consequents Structure Lookup",
  description:
    "Bounded offline reference: Rasa accounts relate determinants, vibh\u0101va, consequents, anubh\u0101va, and transitory states, vyabhic\u0101ribh\u0101va, to aesthetic realization. Source: N\u0101\u1e6dya\u015b\u0101stra6\u20137; Abhinavagupta. The relation is a theoretical account, not a physiological formula or actor diagnosis. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
