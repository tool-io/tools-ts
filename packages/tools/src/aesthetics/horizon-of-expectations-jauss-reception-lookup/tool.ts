import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, shape, pick } from "../batch44-shared.js";

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
          "Jauss horizon of expectations concerns historically situated conventions and prior reception that shape encounters with a work.",
        reference:
          "Jauss, Literary History as a Challenge to Literary Theory 1967.",
        limitations:
          "Not an individualized prediction of every reader or one fixed historical audience.",
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
      text: "Jauss horizon of expectations concerns historically situated conventions and prior reception that shape encounters with a work.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/horizon-of-expectations-jauss-reception-lookup",
  title: "Horizon of Expectations Jauss Reception Lookup",
  description:
    "Bounded offline reference: Jauss horizon of expectations concerns historically situated conventions and prior reception that shape encounters with a work. Source: Jauss, Literary History as a Challenge to Literary Theory 1967. Not an individualized prediction of every reader or one fixed historical audience. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
