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
          "Assignment-of-benefits reforms have changed certain insurance/contract practices in particular jurisdictions and dates.",
        reference: "State insurance statutory history and regulator guidance.",
        limitations:
          "No nationwide ban or current legal effect inferred from the milestone title.",
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
      text: "Assignment-of-benefits reforms have changed certain insurance/contract practices in particular jurisdictions and dates.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/aob-assignment-of-benefits-abuse-reform-bans-history",
  title: "AOB Assignment of Benefits Abuse Reform Bans History",
  description:
    "Bounded offline reference: Assignment-of-benefits reforms have changed certain insurance/contract practices in particular jurisdictions and dates. Source: State insurance statutory history and regulator guidance. No nationwide ban or current legal effect inferred from the milestone title. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
