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
          "Chopmarks can document later commercial handling, but marks can also be added or imitated.",
        reference: "British trade-dollar catalogue scholarship.",
        limitations:
          "Chopmarks do not authenticate host coin, prove geography or guarantee premium.",
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
      text: "Chopmarks can document later commercial handling, but marks can also be added or imitated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/british-trade-dollar-chopmarks-authenticity-sign-lookup",
  title: "British Trade Dollar Chopmarks Authenticity Sign Lookup",
  description:
    "Bounded offline reference: Chopmarks can document later commercial handling, but marks can also be added or imitated. Source: British trade-dollar catalogue scholarship. Chopmarks do not authenticate host coin, prove geography or guarantee premium. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
