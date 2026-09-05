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
          "MGA binding authority is delegated by agreement and can include specified underwriting/administrative functions.",
        reference: "NAIC, MGA framework; binding-authority agreements.",
        limitations:
          "An MGA title does not prove unlimited authority or insurer solvency.",
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
      text: "MGA binding authority is delegated by agreement and can include specified underwriting/administrative functions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/mga-managing-general-agency-binding-authority-delegation-lookup",
  title: "MGA Managing General Agency Binding Authority Delegation Lookup",
  description:
    "Bounded offline reference: MGA binding authority is delegated by agreement and can include specified underwriting/administrative functions. Source: NAIC, MGA framework; binding-authority agreements. An MGA title does not prove unlimited authority or insurer solvency. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
