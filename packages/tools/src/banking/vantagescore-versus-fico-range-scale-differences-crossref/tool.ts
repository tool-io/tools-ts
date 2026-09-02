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
          "Current-generation FICO and VantageScore commonly use300\u2013850, but older versions and specialty scores can use other scales.",
        reference: "FICO and VantageScore consumer model documentation.",
        limitations:
          "Equal numbers need not mean equal calibrated risk; identify the model/version before comparing.",
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
      text: "Current-generation FICO and VantageScore commonly use300\u2013850, but older versions and specialty scores can use other scales.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/vantagescore-versus-fico-range-scale-differences-crossref",
  title: "Vantagescore Versus FICO Range Scale Differences Crossref",
  description:
    "Bounded offline reference: Current-generation FICO and VantageScore commonly use300\u2013850, but older versions and specialty scores can use other scales. Source: FICO and VantageScore consumer model documentation. Equal numbers need not mean equal calibrated risk; identify the model/version before comparing. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
