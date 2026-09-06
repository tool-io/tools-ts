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
          "Repunched mintmarks can result from multiple manual mintmark punches into a die in particular historical minting workflows.",
        reference: "US mint-error and die-variety scholarship.",
        limitations:
          "Mintmark production methods changed by series/date; not every doubled mark is an RPM.",
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
      text: "Repunched mintmarks can result from multiple manual mintmark punches into a die in particular historical minting workflows.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/repunched-mintmark-rpm-hand-punched-era-note",
  title: "Repunched Mintmark RPM Hand Punched Era Note",
  description:
    "Bounded offline reference: Repunched mintmarks can result from multiple manual mintmark punches into a die in particular historical minting workflows. Source: US mint-error and die-variety scholarship. Mintmark production methods changed by series/date; not every doubled mark is an RPM. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
