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
          "Custody safeguards/administers assets; clearing addresses settlement obligations; advisory services provide investment advice under a defined mandate.",
        reference: "SEC, investment-service and custody guidance.",
        limitations:
          "Roles can overlap; a title does not verify license, fiduciary duty or asset safety.",
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
      text: "Custody safeguards/administers assets; clearing addresses settlement obligations; advisory services provide investment advice under a defined mandate.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/custody-versus-clearing-versus-advisory-roles-distinction-lookup",
  title: "Custody Versus Clearing Versus Advisory Roles Distinction Lookup",
  description:
    "Bounded offline reference: Custody safeguards/administers assets; clearing addresses settlement obligations; advisory services provide investment advice under a defined mandate. Source: SEC, investment-service and custody guidance. Roles can overlap; a title does not verify license, fiduciary duty or asset safety. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
