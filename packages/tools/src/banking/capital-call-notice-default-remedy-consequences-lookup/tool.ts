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
          "Capital-call notices specify commitments, due dates and payment instructions; default remedies depend on governing fund agreements.",
        reference:
          "Private-fund partnership agreements and investor disclosure practice.",
        limitations:
          "Authenticate payment changes independently; no universal forfeiture, penalty or legal remedy inferred.",
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
      text: "Capital-call notices specify commitments, due dates and payment instructions; default remedies depend on governing fund agreements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/capital-call-notice-default-remedy-consequences-lookup",
  title: "Capital Call Notice Default Remedy Consequences Lookup",
  description:
    "Bounded offline reference: Capital-call notices specify commitments, due dates and payment instructions; default remedies depend on governing fund agreements. Source: Private-fund partnership agreements and investor disclosure practice. Authenticate payment changes independently; no universal forfeiture, penalty or legal remedy inferred. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
