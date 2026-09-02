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
          "Credit-union fields of membership vary by charter type, including occupational, associational and community criteria.",
        reference: "NCUA, chartering and field-of-membership guidance.",
        limitations:
          "A general label does not establish individual eligibility or current branch participation.",
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
      text: "Credit-union fields of membership vary by charter type, including occupational, associational and community criteria.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/credit-union-field-of-membership-charter-types-lookup",
  title: "Credit Union Field of Membership Charter Types Lookup",
  description:
    "Bounded offline reference: Credit-union fields of membership vary by charter type, including occupational, associational and community criteria. Source: NCUA, chartering and field-of-membership guidance. A general label does not establish individual eligibility or current branch participation. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
