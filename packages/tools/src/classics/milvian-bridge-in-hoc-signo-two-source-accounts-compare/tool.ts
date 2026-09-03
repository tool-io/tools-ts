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
          "Lactantius describes a prebattle dream directing a shield sign; Eusebius later describes a sky vision and subsequent dream.",
        reference:
          "Lactantius, De mortibus persecutorum44; Eusebius, Vita Constantini 1.28\u201332.",
        limitations:
          "Sources differ in date, genre and narrative; the familiar Latin phrase is not a securely identical contemporary account.",
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
      text: "Lactantius describes a prebattle dream directing a shield sign; Eusebius later describes a sky vision and subsequent dream.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/milvian-bridge-in-hoc-signo-two-source-accounts-compare",
  title: "Milvian Bridge in Hoc Signo Two Source Accounts Compare",
  description:
    "Bounded offline reference: Lactantius describes a prebattle dream directing a shield sign; Eusebius later describes a sky vision and subsequent dream. Source: Lactantius, De mortibus persecutorum44; Eusebius, Vita Constantini 1.28\u201332. Sources differ in date, genre and narrative; the familiar Latin phrase is not a securely identical contemporary account. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
